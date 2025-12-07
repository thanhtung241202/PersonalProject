"""
from datetime import datetime, time
from vnstock import Vnstock
import queue
from datetime import datetime, time, date
from vnstock import Vnstock
from dateutil.relativedelta import relativedelta
from vnstock import Quote
import pandas as pd

#results_queue = queue.Queue(maxsize=30)
results_queues = {}

def is_trading_time():
    now = datetime.now()
    weekday = now.weekday()
    if weekday >= 5:  # T7, CN
        return False

    # Các khung giờ
    morning_open   = time(9, 0)
    morning_close  = time(11, 30)
    afternoon_open = time(13, 0)
    afternoon_close= time(15, 0)

    current_time = now.time()

    return (
        (morning_open <= current_time <= morning_close) or
        (afternoon_open <= current_time <= afternoon_close)
    )

# --- 2. Tìm mã chứng khoán ---
def stockFind(symbol):
    vn = Vnstock()
    return vn.stock(symbol=symbol, source="VCI")

# --- 3. Lấy dữ liệu intraday ---
def stockIntraday(stock):
    if not is_trading_time():
        return None
    df = stock.quote.intraday(page_size=30, show_log=False)
    if df.empty:
        return None
    return df.iloc[-1]

# --- 4. Chuẩn hóa dữ liệu ---
def stockIntradayFilter(df_row):
    if df_row is None:
        return None
    time_str = str(df_row["time"])
    price = float(df_row["price"])
    return [time_str, price]

def stockUpdate(symbol):
    stock = stockFind(symbol)
    intraday_data = stockIntraday(stock)
    return stockIntradayFilter(intraday_data)

# --- 6. Queue update ---
def queueStockUpdate(symbol):
    if symbol not in results_queues:
        results_queues[symbol] = queue.Queue(maxsize=30)
    
    q = results_queues[symbol]
    point = stockUpdate(symbol)
    if point:
        if q.qsize() >= 30:
            q.get()
        q.put(point)
    return q


def stockTrackMonth(symbol):
    today = date.today()
    quote = Quote(symbol=symbol, source='VCI')
    one_month_ago = today - relativedelta(months=1)
    one_month_ago_str = one_month_ago.strftime('%Y-%m-%d')
    df = quote.history(start = one_month_ago_str, end = today.strftime('%Y-%m-%d'))
    return df

def extract_time_and_close_separate(df):
    if df.empty:
        return [], []
    df = df.copy() 
    if not pd.api.types.is_datetime64_any_dtype(df['time']):
        df['time'] = pd.to_datetime(df['time'])
    times_array = df['time'].dt.strftime('%d-%m-%Y').tolist()
    closes_array = df['close'].astype(float).tolist()
    return times_array, closes_array

def stockUpdateMonthly(symbol):
    df = stockTrackMonth(symbol)
    times_array, closes_array = extract_time_and_close_separate(df)
    return times_array, closes_array

"""

import pandas as pd
import time
from datetime import datetime, time as dt_time, date
from dateutil.relativedelta import relativedelta
from vnstock import Vnstock, Quote

# --- GLOBAL STATE ---
# Cấu trúc: {'VIC': {'times': ['14:00:00', ...], 'prices': [50.1, ...]}}
results_queues = {}

# Khởi tạo 1 lần dùng chung (Singleton)
vn = Vnstock()

# --- 1. KIỂM TRA GIỜ GIAO DỊCH ---
def is_trading_time():
    # Mẹo: Nếu muốn test ngoài giờ, hãy return True tạm thời
    # return True 
    now = datetime.now()
    if now.weekday() >= 5: return False  # T7, CN

    t = now.time()
    morning = (dt_time(9, 0) <= t <= dt_time(11, 30))
    afternoon = (dt_time(13, 0) <= t <= dt_time(15, 0))
    return morning or afternoon

# --- 2. LẤY DỮ LIỆU TỪ API ---
def get_raw_data(symbol, limit=30):
    """Lấy DataFrame từ Vnstock"""
    try:
        stock = vn.stock(symbol=symbol, source="VCI")
        df = stock.quote.intraday(page_size=limit, show_log=False)
        return df if not df.empty else None
    except Exception:
        return None

def parse_data_intraday(df):
    """Chuyển đổi DataFrame thành 2 list: times và prices"""
    df = df.copy()
    if not pd.api.types.is_datetime64_any_dtype(df['time']):
        df['time'] = pd.to_datetime(df['time'])
    
    # Format chuẩn cho chart Intraday: DD-MM-YYYY HH:MM:SS
    times = df['time'].dt.strftime('%d-%m-%Y %H:%M:%S').tolist()
    prices = df['close'].astype(float).tolist()
    return times, prices

# --- 3. KHỞI TẠO DỮ LIỆU (Lần đầu tiên) ---
def init_symbol_data(symbol):
    """Lấy 30 điểm dữ liệu đầu tiên để nạp vào chart"""
    if symbol in results_queues:
        return results_queues[symbol]

    print(f"[*] Init data for: {symbol}")
    df = get_raw_data(symbol, limit=30)
    
    if df is None:
        results_queues[symbol] = {'times': [], 'prices': []}
    else:
        # Đảm bảo chỉ lấy tối đa 30 điểm cuối
        if len(df) > 30:
            df = df.tail(30)
        
        times, prices = parse_data_intraday(df)
        results_queues[symbol] = {
            'times': times,
            'prices': prices
        }
    return results_queues[symbol]

# --- 4. CẬP NHẬT DỮ LIỆU (Chạy trong vòng lặp) ---
def update_symbol_state(symbol):
    """Lấy 1 điểm mới nhất và cập nhật vào Queue"""
    if symbol not in results_queues:
        return

    # Lấy 1 điểm mới nhất
    df = get_raw_data(symbol, limit=5)
    if df is None: return

    # Lấy dòng cuối cùng
    last_row = df.iloc[[-1]] 
    new_times, new_prices = parse_data_intraday(last_row)
    
    new_time = new_times[0]
    new_price = new_prices[0]

    # Lấy queue hiện tại
    q_times = results_queues[symbol]['times']
    q_prices = results_queues[symbol]['prices']

    # Logic Queue: Chỉ thêm nếu thời gian khác cái cũ nhất
    if not q_times or new_time != q_times[-1]:
        q_times.append(new_time)
        q_prices.append(new_price)
        
        # Pop đầu nếu quá 30
        if len(q_times) > 30:
            q_times.pop(0)
            q_prices.pop(0)
            
        # print(f"-> Updated {symbol}: {new_time}") # Uncomment để debug

# --- 5. TÁC VỤ CHẠY NGẦM (Background Task) ---
def auto_update_process(symbol):
    """Hàm này sẽ được FastAPI gọi chạy ngầm"""
    print(f"[Background] Start tracking: {symbol}")
    while True:
        # Nếu hết giờ thì dừng loop để tiết kiệm tài nguyên
        if not is_trading_time():
            print(f"[Background] Stop tracking {symbol} (Out of trading time)")
            break
            
        try:
            update_symbol_state(symbol)
        except Exception as e:
            print(f"Error updating {symbol}: {e}")
        
        time.sleep(5) # Nghỉ 5s

# --- 6. XỬ LÝ MONTHLY (Giữ nguyên) ---
def stockTrackMonth(symbol):
    today = date.today()
    quote = Quote(symbol=symbol, source='VCI')
    one_month_ago = today - relativedelta(months=1)
    one_month_ago_str = one_month_ago.strftime('%Y-%m-%d')
    df = quote.history(start=one_month_ago_str, end=today.strftime('%Y-%m-%d'))
    return df

def monthly_extract(df):
    if df.empty:
        return [], []
    df = df.copy()
    if not pd.api.types.is_datetime64_any_dtype(df['time']):
        df['time'] = pd.to_datetime(df['time'])
    times_array = df['time'].dt.strftime('%d-%m-%Y').tolist()
    closes_array = df["close"].astype(float).tolist()
    return times_array, closes_array

def stockUpdateMonthly(symbol):
    df = stockTrackMonth(symbol)
    times_array, closes_array = monthly_extract(df)
    return times_array, closes_array