from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from StockUpdate import (
    results_queues, 
    init_symbol_data, 
    auto_update_process,
    is_trading_time,
    stockUpdateMonthly
)

app = FastAPI()


origins = [
    "http://localhost:3000", 
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#uvicorn main:app --reload --port 8000
#http://127.0.0.1:8000/daily/data?symbol=VIC
@app.get("/daily/data")
def get_daily_data(symbol: str, background_tasks: BackgroundTasks):
    symbol = symbol.upper() 
    if symbol not in results_queues:
        init_symbol_data(symbol)
        if is_trading_time():
            background_tasks.add_task(auto_update_process, symbol)
            print(f"-> Da kich hoat chay ngam cho: {symbol}")
    data = results_queues.get(symbol, {'times': [], 'prices': []})
    
    return {
        "labels": data['times'], 
        "values": data['prices']
    }
#uvicorn main:app --reload --port 8000
#http://127.0.0.1:8000/monthly/data?symbol=VIC
@app.get("/monthly/data")
def get_monthly_data(symbol: str = "VIC"):
    symbol = symbol.upper()
    try:
        times_array, closes_array = stockUpdateMonthly(symbol)
        return {"labels": times_array, "values": closes_array}
    except Exception as e:
        print(f"Loi monthly: {e}")
        return {"labels": [], "values": []}