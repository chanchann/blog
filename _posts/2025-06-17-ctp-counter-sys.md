---
layout: post
title: "CTP - Counter System"
author: "chanchan"
categories: journal
tags: [ctp]
image: mountains.jpg
toc: true
---

The CTP (Comprehensive Trading Platform) API, developed by Shanghai Futures Information Technology Co., Ltd., is a critical interface for programmatic trading in Chinese futures markets, including commodity futures. The "柜台系统" (Counter System) refers to the front-office system or trading infrastructure that facilitates interaction between traders (or their applications) and the exchange’s backend systems. In the context of the CTP API, the counter system encompasses the client-side API, server-side infrastructure, and operational mechanisms that enable trading, market data retrieval, and account management. Below, I’ll provide a detailed explanation of the CTP API’s counter system, focusing on its architecture, components, functionalities, and operational considerations, particularly for use with the SimNow simulation platform.

---

### 1. **Overview of the CTP Counter System**
The CTP counter system is the intermediary layer that connects traders’ applications to the futures exchange’s matching engine and market data systems. It is designed to provide a robust, low-latency, and secure interface for both individual traders and institutional clients to access Chinese futures markets, such as the Shanghai Futures Exchange (SHFE), Dalian Commodity Exchange (DCE), Zhengzhou Commodity Exchange (CZCE), and China Financial Futures Exchange (CFFEX). The counter system in the CTP API context is responsible for:
- **Market Data Access**: Subscribing to and receiving real-time market quotes (e.g., price, volume, depth).
- **Trading Operations**: Placing, modifying, and canceling orders, as well as managing positions and account details.
- **Risk Control**: Enforcing exchange rules, such as margin requirements and trading limits.
- **Data Security**: Ensuring secure communication and authentication between clients and exchange servers.

In the SimNow environment, the counter system replicates the real-world CTP infrastructure, allowing developers to test trading strategies and API integrations in a simulated setting that mirrors actual market conditions.

---

### 2. **Architecture of the CTP Counter System**
The CTP counter system operates on a client-server model, with distinct components for market data and trading functionalities. Below is a breakdown of its architecture:

#### **2.1. Client-Side Components**
- **CTP API Libraries**:  
  The client interacts with the counter system through two primary APIs:  
  - **ThostFtdcMdApi (Market Data API)**: Handles subscription to and receipt of market data (e.g., real-time quotes, depth data).  
  - **ThostFtdcTraderApi (Trading API)**: Manages trading operations, including order placement, cancellation, and account queries.  
  These APIs are provided as dynamic link libraries (DLLs) for Windows or shared libraries (SO files) for Linux, along with header files (`ThostFtdcUserApiDataType.h`, `ThostFtdcUserApiStruct.h`, `FtdcTraderApi.h`, `ThostFtdcMdApi.h`).

- **Callback Mechanism**:  
  The CTP API uses an event-driven model where the client implements callback functions to handle asynchronous responses from the server. For example:  
  - Market Data: `OnRtnDepthMarketData` for receiving tick data.  
  - Trading: `OnRtnOrder` for order updates, `OnRtnTrade` for trade confirmations, and `OnErrRtnOrderInsert` for order rejection errors.

- **Communication Protocols**:  
  The counter system uses the proprietary FTD (Futures Trading Data) protocol over TCP for reliable, low-latency communication. The protocol supports three communication modes:  
  - **Dialogue Mode**: Client-initiated requests (e.g., login, order submission) with synchronous responses.  
  - **Private Mode**: Server pushes updates specific to the client (e.g., order status, trade confirmations).  
  - **Broadcast Mode**: Server broadcasts market data to all subscribed clients.

#### **2.2. Server-Side Components**
The server-side counter system, hosted by SimNow or real futures exchanges, consists of:
- **Front Servers**:  
  - **Market Data Front**: Distributes real-time market quotes and depth data to subscribed clients.  
  - **Trading Front**: Processes trading requests (e.g., order placement, cancellation) and forwards them to the exchange’s matching engine.  
  - SimNow provides specific server addresses for testing, such as:  
    - Trade Front: `180.168.146.187:10201` (first group).  
    - Market Front: `180.168.146.187:10211` (first group).  
    - 7x24 Environment: `180.168.146.187:10130` (trade) and `10131` (market data).

- **Matching Engine**:  
  The exchange’s backend system that matches buy and sell orders based on price-time priority. In SimNow, this is simulated to replicate real-world matching logic.

- **Risk Control Layer**:  
  The counter system enforces exchange-specific rules, such as:  
  - Price limits (daily price movement caps).  
  - Margin requirements for each contract.  
  - Position limits to prevent excessive exposure.  
  - Order frequency restrictions (e.g., one request every 2 seconds to avoid overloading the system).

- **Settlement System**:  
  In real trading, the counter system handles daily settlement, calculating profits/losses and updating account balances. In SimNow, settlement is simulated during trading hours, except in the 7x24 environment, which does not support settlement.

#### **2.3. Authentication and Security**
- **Login Process**:  
  Clients authenticate with the counter system using:  
  - **Broker ID**: `9999` for SimNow.  
  - **Investor ID**: Assigned during SimNow registration.  
  - **Password**: Set or changed via the SimNow website or client software.  
  - **APPID and Authentication Code**: Defaults are `simnow_client_test` and `0000000000000000` (16 zeros), respectively. Terminal authentication can be disabled for programmatic access.

- **Security Features**:  
  - Encrypted communication to protect sensitive data (e.g., account details, orders).  
  - Session management to ensure only authorized clients access the system.  
  - Rate limiting to prevent abuse (e.g., excessive order submissions).

---

### 3. **Key Functionalities of the CTP Counter System**
The counter system supports a range of functionalities critical for commodity futures trading. Below are the primary features:

#### **3.1. Market Data Services**
- **Subscription**:  
  Clients use `ThostFtdcMdApi` to subscribe to specific futures contracts (e.g., copper, soybeans) by specifying instrument IDs (e.g., `cu2312` for a copper futures contract expiring in December 2023).  
  - Example: Call `SubscribeMarketData` with a list of instrument IDs.

- **Data Types**:  
  - **Level 1 Data**: Includes bid/ask prices, last price, volume, and open interest.  
  - **Depth Data**: Provides bid/ask depth (e.g., top 5 levels) for supported contracts.  
  - **Tick Frequency**: SimNow delivers approximately 2 ticks per second, lower than some cryptocurrency APIs (e.g., 10 ticks/second).

- **Callbacks**:  
  - `OnRtnDepthMarketData`: Delivers real-time tick data.  
  - `OnRspSubMarketData`: Confirms successful subscription.  
  - Note: SimNow does not provide historical data or tick-by-tick transaction data. Historical data must be sourced from third-party providers.

#### **3.2. Trading Services**
- **Order Placement**:  
  - Use `ThostFtdcTraderApi` to submit orders via `ReqOrderInsert`.  
  - Supported order types in SimNow:  
    - **Limit Orders**: Specify a price and quantity.  
    - **Fill-and-Kill (FAK)**: Executes immediately at the specified price or cancels if unfillable.  
    - **Fill-or-Kill (FOK)**: Executes fully at the specified price or cancels entirely.  
  - **Market Orders**: Not supported in SimNow, unlike some real trading environments.

- **Order Management**:  
  - **Modify Orders**: Use `ReqOrderAction` to amend existing orders (e.g., change price or quantity).  
  - **Cancel Orders**: Cancel pending orders via `ReqOrderAction`.  
  - **Order Status**: Monitor order updates via callbacks like `OnRtnOrder` (order status changes) and `OnRtnTrade` (trade executions).

- **Position and Account Queries**:  
  - Query account balance, margin, and available funds using `ReqQryTradingAccount`.  
  - Retrieve open positions with `ReqQryInvestorPosition`.  
  - Query order and trade history via `ReqQryOrder` and `ReqQryTrade`.

#### **3.3. Risk Management**
- The counter system enforces exchange rules to prevent invalid trades:  
  - **Price Limits**: Orders outside the daily price range are rejected.  
  - **Margin Checks**: Ensures sufficient margin for new positions.  
  - **Position Limits**: Caps the number of contracts per account to manage risk.  
  - **Order Frequency**: Limits request rates (e.g., one order every 2 seconds) to prevent system overload.

#### **3.4. Settlement and Clearing**
- In SimNow, the counter system simulates daily settlement during trading hours, updating account balances and positions based on market prices.  
- The 7x24 environment does not support settlement, as it uses historical data playback for testing outside trading hours.

---

### 4. **Operational Considerations**
To effectively use the CTP counter system, developers and traders must understand its operational nuances:

#### **4.1. SimNow Environment**
- **Server Groups**:  
  - **First and Second Groups**: Available during trading hours (Monday to Friday, including night sessions), providing live market data and full trading functionality.  
  - **7x24 Environment**: Available outside trading hours for testing with historical data playback but lacks settlement.  
  - **Second Environment**: Dedicated to API testing, with no settlement or advanced features.

- **Trading Hours**:  
  - SimNow follows the trading hours of Chinese futures exchanges (e.g., 9:00 AM–3:00 PM and 9:00 PM–2:30 AM for night sessions, depending on the contract).  
  - The platform is unavailable on weekends and holidays.

- **Account Setup**:  
  - Register on http://www.simnow.com.cn/ to obtain an Investor ID and password.  
  - Use Broker ID `9999` for SimNow.  
  - Change the default password via the website or SimNow Fast Client software.

#### **4.2. Development and Integration**
- **Programming Languages**:  
  - The CTP API is primarily designed for C++ but can be wrapped for Python, Rust, or other languages using FFI (Foreign Function Interface) libraries like `pybind11` or `cc-rs`.  
  - Example: Python developers can refer to tutorials like https://zhuanlan.zhihu.com/p/20031660 for wrapping CTP APIs.

- **Setup Steps**:  
  1. **Download API Files**: Obtain DLLs (`thosttraderapi.dll`, `thostmduserapi.dll`) and header files from http://www.simnow.com.cn/static/apiDownload.action.  
  2. **Configure Servers**: Specify trading and market data front addresses in your application.  
  3. **Implement Callbacks**: Define callback functions to handle market data, order updates, and errors.  
  4. **Test Connectivity**: Use `telnet` to verify server availability (e.g., `telnet 180.168.146.187 10201`).  
  5. **Debugging**: Log API responses to troubleshoot issues like login failures or order rejections.

- **Best Practices**:  
  - Use separate threads for market data and trading to avoid blocking.  
  - Handle errors gracefully (e.g., check `OnRspError` for server-side issues).  
  - Monitor rate limits to avoid restrictions from excessive requests.

#### **4.3. Limitations**
- **No Market Orders**: SimNow only supports limit, FAK, and FOK orders.  
- **No Tick-by-Tick Transaction Data**: Unlike some cryptocurrency APIs, CTP does not provide detailed transaction-level data.  
- **Historical Data**: Not available through SimNow; use third-party providers for backtesting.  
- **Rate Limits**: Strict limits on order submission frequency (e.g., one request every 2 seconds).

---

### 5. **Practical Workflow for Using the CTP Counter System**
1. **Register on SimNow**: Create an account to obtain an Investor ID and password.  
2. **Download API Files**: Get the necessary libraries and headers from the SimNow website.  
3. **Develop Application**: Write code to connect to the counter system, subscribe to market data, and implement trading logic.  
4. **Configure Servers**: Use the appropriate server addresses for trading and market data.  
5. **Test in SimNow**: Run your application during trading hours to validate connectivity and strategy performance.  
6. **Monitor and Debug**: Use logs and callbacks to troubleshoot issues like connection failures or order rejections.  
7. **Prepare for Live Trading**: Modify server addresses and credentials for real exchange environments after thorough testing.

---

### 6. **Comparison with Other Counter Systems**
- **CTP vs. Cryptocurrency APIs**:  
  - CTP uses a TCP-based FTD protocol, while crypto APIs often use REST or WebSocket.  
  - CTP has lower tick frequency (2 ticks/second) compared to crypto APIs (up to 10 ticks/second).  
  - CTP’s counter system is tailored for regulated futures markets, with stricter risk controls.

- **CTP vs. Global Futures APIs**:  
  - Unlike APIs for CME Group or Eurex, CTP is optimized for Chinese futures exchanges, with specific support for SHFE, DCE, CZCE, and CFFEX contracts.  
  - CTP’s counter system is known for high stability but may lack some advanced features (e.g., market orders in SimNow).

---

### 7. **Additional Resources**
- **SimNow Website**: http://www.simnow.com.cn/ for registration, API downloads, and server details.  
- **API Documentation**: Available at http://www.sfit.com.cn/5_2_DocumentDown.htm.  
- **Community Resources**: Check CSDN, GitHub, or forums for sample code and tutorials (e.g., Python or Rust wrappers).  
- **Client Software**: Use SimNow Fast Client (e.g., TradeNow, Quick 3) for manual trading alongside API testing.

---

### 8. **Key Considerations**
- **Simulation vs. Real Trading**: SimNow’s counter system closely mirrors real exchanges but lacks some features (e.g., market orders). Test thoroughly before transitioning to live trading.  
- **Connectivity**: Verify server availability with `telnet` if connection issues arise.  
- **Security**: Use unique credentials for SimNow to avoid conflicts with real accounts.  
- **Performance**: Optimize your application for low latency, as the counter system processes high-frequency requests in real-time.
