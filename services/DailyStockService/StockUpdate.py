import pandas as pd
import time
from datetime import datetime, time as dt_time, date
from dateutil.relativedelta import relativedelta
from vnstock import Vnstock, Quote


results_queues = {}


vn = Vnstock()


def is_trading_time():
    now = datetime.now()
    if now.weekday() >= 5: return False  # T7, CN

    t = now.time()
    morning = (dt_time(9, 0) <= t <= dt_time(11, 30))
    afternoon = (dt_time(13, 0) <= t <= dt_time(15, 0))
    return morning or afternoon

def get_raw_data(symbol, limit=30):
    """Lấy DataFrame từ Vnstock"""
    try:
        stock = vn.stock(symbol=symbol, source="VCI")
        df = stock.quote.intraday(page_size=limit, show_log=False)
        return df if not df.empty else None
    except Exception:
        return None

def parse_data_intraday(df):
    df = df.copy()
    if not pd.api.types.is_datetime64_any_dtype(df['time']):
        df['time'] = pd.to_datetime(df['time'])
    
    # Format chuẩn cho chart Intraday: DD-MM-YYYY HH:MM:SS
    times = df['time'].dt.strftime('%d-%m-%Y %H:%M:%S').tolist()
    prices = df['close'].astype(float).tolist()
    prices = prices*1000
    return times, prices

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

# --- 6. XỬ LÝ MONTHLY ---
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
    closes_array = (df["close"].astype(float)*1000).tolist()
    return times_array, closes_array

def stockUpdateMonthly(symbol):
    df = stockTrackMonth(symbol)
    times_array, closes_array = monthly_extract(df)
    return times_array, closes_array