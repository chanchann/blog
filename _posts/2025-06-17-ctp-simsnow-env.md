---
layout: post
title: "CTP - SimNow environment"
author: "chanchan"
categories: journal
tags: [ctp]
image: mountains.jpg
toc: true
---

The SimNow environment, provided by Shanghai Futures Information Technology Co., Ltd., a subsidiary of the Shanghai Futures Exchange (SHFE), is a simulated trading platform designed for testing trading strategies, learning market rules, and developing applications using the CTP (Comprehensive Trading Platform) API. It replicates the trading and settlement rules of major Chinese futures exchanges, including the SHFE, Dalian Commodity Exchange (DCE), Zhengzhou Commodity Exchange (CZCE), and China Financial Futures Exchange (CFFEX), in a risk-free setting. Below, I provide a comprehensive overview of the key knowledge points for the SimNow environment, focusing on its purpose, setup, server configurations, functionalities, limitations, and practical considerations for commodity futures trading as of June 17, 2025.

---

### 1. **Overview of SimNow Environment**
- **Purpose**:  
  SimNow is a simulation platform that allows traders, developers, and investors to:  
  - **Learn Market Rules**: Understand futures trading mechanics, such as margin requirements, price limits, and settlement procedures, without financial risk.  
  - **Test Trading Strategies**: Evaluate manual or algorithmic strategies (e.g., CTA, arbitrage) in a realistic environment.  
  - **Develop Applications**: Build and debug trading systems using the CTP API, ensuring compatibility with real exchange systems.  
  - **Educate Users**: Provide a sandbox for beginners to practice trading and for professionals to refine systems.

- **Supported Markets**:  
  SimNow mirrors the trading environment of major Chinese futures exchanges:  
  - SHFE: Commodities like copper, aluminum, crude oil.  
  - DCE: Soybeans, corn, iron ore.  
  - CZCE: Sugar, cotton, rapeseed oil.  
  - CFFEX: Financial futures like stock index futures.  

- **Key Features**:  
  - Real-time market data and trading simulation.  
  - Support for CTP API for programmatic trading.  
  - Multiple server groups for different use cases (e.g., trading hours, 7x24 testing).  
  - Simulated settlement and risk management aligned with real exchange rules.

---

### 2. **Key Knowledge Points of the SimNow Environment**

#### **2.1. Account Setup and Access**
- **Registration**:  
  - Register on the SimNow website (http://www.simnow.com.cn/) using a valid Chinese mobile number (China Mobile or China Unicom preferred) or email for verification.  
  - Each phone number or email can register only one account.  
  - Upon registration, you receive an **Investor ID** (not the phone number) and a default password.  
  - The password must be changed after the first login (via the website or SimNow Fast Client software) for API access.  
  - New accounts may take up to the third trading day to access certain environments (e.g., the second CTP API testing environment).

- **Broker ID**:  
  - Standardized as **9999** for all SimNow users, used in API configurations to identify the simulated brokerage.

- **Authentication for API**:  
  - **APPID**: Default is `simnow_client_test`.  
  - **Authentication Code**: Default is `0000000000000000` (16 zeros).  
  - Terminal authentication can be disabled for programmatic access.  
  - Ensure the Investor ID and password are correctly configured in the CTP API for login.

#### **2.2. Server Configurations**
SimNow provides multiple server groups to cater to different testing needs, each with specific trading and market data fronts. These are detailed in the SimNow Fast Client download package (e.g., `ctp_sim.xml`) or on the website. Key server groups include:

- **First Group (Telecom)**:  
  - **Trade Front**: `180.168.146.187:10201`  
  - **Market Front**: `180.168.146.187:10211`  
  - Available during trading hours, mirrors real-time market conditions.

- **Second Group (Telecom)**:  
  - **Trade Front**: `180.168.146.187:10202`  
  - **Market Front**: `180.168.146.187:10212`  
  - Similar to the first group, used for load balancing or alternative connectivity.

- **Third Group (Mobile)**:  
  - **Trade Front**: `218.202.237.33:10203`  
  - **Market Front**: `218.202.237.33:10213`  
  - Alternative connectivity option, often used for mobile network users.

- **7x24 Environment**:  
  - **Trade Front**: `180.168.146.187:10130`  
  - **Market Front**: `180.168.146.187:10131`  
  - Available outside trading hours, uses historical data playback for testing (no settlement).

- **Second Environment (API Testing)**:  
  - Dedicated for CTP API development and testing.  
  - Does not support settlement or advanced features like the first group.  
  - Access may be delayed for new accounts (up to the third trading day).

- **Trading Hours**:  
  - SimNow follows the trading hours of Chinese futures exchanges:  
    - Day session: Typically 9:00 AM–11:30 AM and 1:30 PM–3:00 PM (China Standard Time).  
    - Night session: 9:00 PM–2:30 AM (varies by contract, e.g., copper, crude oil).  
  - Unavailable on weekends and Chinese public holidays.  
  - The 7x24 environment allows testing during non-trading hours but uses replayed data.

#### **2.3. CTP API Integration**
SimNow is designed for use with the CTP API, which consists of two main interfaces:
- **ThostFtdcMdApi (Market Data API)**:  
  - Subscribe to real-time quotes for specific contracts (e.g., `cu2312` for copper futures).  
  - Provides Level 1 data (bid/ask prices, last price, volume, open interest) and depth data (top 5 bid/ask levels).  
  - Tick frequency: ~2 ticks/second (lower than cryptocurrency APIs).  
  - Key methods: `SubscribeMarketData`, `UnSubscribeMarketData`.  
  - Key callbacks: `OnRtnDepthMarketData`, `OnRspSubMarketData`.

- **ThostFtdcTraderApi (Trading API)**:  
  - Supports order placement, cancellation, and queries for account/position details.  
  - Order types in SimNow:  
    - **Limit Orders**: Specify price and quantity.  
    - **Fill-and-Kill (FAK)**: Executes immediately or cancels.  
    - **Fill-or-Kill (FOK)**: Executes fully or cancels.  
    - **Market Orders**: Not supported in SimNow.  
  - Key methods: `ReqOrderInsert`, `ReqOrderAction`, `ReqQryTradingAccount`, `ReqQryInvestorPosition`.  
  - Key callbacks: `OnRtnOrder`, `OnRtnTrade`, `OnRspError`.

- **API Files**:  
  - Download from http://www.simnow.com.cn/static/apiDownload.action.  
  - Includes header files (`ThostFtdcUserApiDataType.h`, `ThostFtdcUserApiStruct.h`, etc.) and libraries (`thostmduserapi_se.dll`, `thosttraderapi_se.dll` for Windows; `.so` for Linux).

- **Communication Protocol**:  
  - Uses TCP-based FTD protocol with three modes:  
    - **Dialogue Mode**: Client-initiated requests (e.g., login, order submission).  
    - **Private Mode**: Server pushes client-specific updates (e.g., order status).  
    - **Broadcast Mode**: Server broadcasts market data to subscribed clients.

#### **2.4. Trading and Settlement Rules**
- **Contract Rules**:  
  - SimNow replicates the trading rules of SHFE, DCE, CZCE, and CFFEX, including:  
    - Margin requirements (e.g., initial and maintenance margins).  
    - Daily price limits (e.g., ±7% for some contracts).  
    - Position limits to control risk exposure.  
  - Contracts include commodities (e.g., copper, soybeans) and financial futures (e.g., CSI 300 index futures).

- **Order Restrictions**:  
  - Strict rate limits: ~1 request every 2 seconds to prevent system overload.  
  - Excessive order submissions or cancellations may trigger restrictions or temporary bans.

- **Settlement**:  
  - Simulated during trading hours in the first and second server groups, updating account balances and positions based on market prices.  
  - Not supported in the 7x24 environment, which uses historical data playback.  
  - The second environment (API testing) does not support settlement.

#### **2.5. Data Limitations**
- **Real-Time Data**:  
  - Provides Level 1 and depth data but no tick-by-tick transaction data (unlike some cryptocurrency APIs).  
  - Tick frequency: ~2 ticks/second, sufficient for most strategies but lower than high-frequency trading platforms.

- **Historical Data**:  
  - SimNow does not provide historical market data.  
  - For backtesting, use third-party data providers (e.g., Wind, Choice) or real trading accounts with futures companies.

#### **2.6. Development and Testing**
- **Supported Languages**:  
  - Native: C++ (using provided DLLs/SO files).  
  - Wrapped: Python (via `pybind11`), Rust (via `cc-rs`), or other languages with FFI.  
  - Example: Python wrapper tutorials on CSDN (e.g., https://zhuanlan.zhihu.com/p/20031660).

- **Development Workflow**:  
  1. **Download API Files**: From the SimNow website.  
  2. **Configure Servers**: Use appropriate trading and market data front addresses.  
  3. **Implement Callbacks**: Handle asynchronous responses (e.g., `OnRtnDepthMarketData`, `OnRtnTrade`).  
  4. **Test Connectivity**: Verify server availability with `telnet` (e.g., `telnet 180.168.146.187 10201`).  
  5. **Debug**: Monitor logs in the flow control directory for issues like login failures or order rejections.

- **Best Practices**:  
  - Use separate threads for market data and trading to avoid blocking.  
  - Implement robust error handling (e.g., `OnRspError`, `OnErrRtnOrderInsert`).  
  - Test during trading hours for real-time data accuracy.  
  - Simulate various market conditions to ensure strategy robustness.

#### **2.7. Client Software**
- **SimNow Fast Client**:  
  - Tools like TradeNow or Quick 3 allow manual trading alongside API testing.  
  - Download from the SimNow website.  
  - Useful for verifying account status, changing passwords, or monitoring orders manually.

- **Use Case**:  
  - Combine manual trading (via client software) with API-based testing to validate strategy performance.  
  - Check order and position status in the client software to debug API issues.

#### **2.8. Limitations and Constraints**
- **No Market Orders**: SimNow supports only limit, FAK, and FOK orders.  
- **Data Restrictions**: No historical data or transaction-level quotes.  
- **Availability**: Unavailable on weekends and holidays; 7x24 environment uses replayed data.  
- **Account Activation Delay**: New accounts may face delays (up to three trading days) for certain environments.  
- **Rate Limits**: Strict request frequency limits to prevent abuse.

---

### 3. **Practical Workflow for Using SimNow**
1. **Register Account**: Sign up on http://www.simnow.com.cn/ to obtain Investor ID and password.  
2. **Download API and Client Software**: Get CTP API files and Fast Client from the website.  
3. **Configure Application**: Set up server addresses, Investor ID, and Broker ID (`9999`) in your CTP API application.  
4. **Develop and Test**:  
   - Subscribe to market data and place test orders during trading hours.  
   - Use the 7x24 environment for off-hours testing with historical data.  
   - Debug using logs and client software.  
5. **Validate Strategies**: Test trading logic under simulated market conditions.  
6. **Prepare for Live Trading**: Modify server addresses and credentials for real exchange environments after thorough testing.

---

### 4. **Comparison with Real Trading Environments**
- **Similarities**:  
  - Replicates trading rules, margin requirements, and settlement processes of real exchanges.  
  - Uses the same CTP API interface as live trading systems.  
  - Provides real-time market data during trading hours.

- **Differences**:  
  - No financial risk in SimNow; real trading involves actual capital.  
  - SimNow lacks market orders and tick-by-tick transaction data.  
  - Limited historical data access compared to real trading accounts.  
  - The 7x24 environment uses replayed data, not live market conditions.

---

### 5. **Additional Resources**
- **SimNow Website**: http://www.simnow.com.cn/ for registration, API downloads, server details, and FAQs.  
- **API Documentation**: http://www.sfit.com.cn/5_2_DocumentDown.htm.  
- **Community Support**: GitHub, CSDN, or forums for sample code (e.g., Python/Rust wrappers).  
- **Client Software**: SimNow Fast Client (TradeNow, Quick 3) for manual trading and account management.

---

### 6. **Key Considerations**
- **Simulation vs. Real Trading**: SimNow is ideal for testing but does not fully replicate real market dynamics (e.g., liquidity, slippage). Test thoroughly before live deployment.  
- **Connectivity**: Use `telnet` to verify server availability if connection issues arise (e.g., `telnet 180.168.146.187 10201`).  
- **Security**: Use unique credentials for SimNow to avoid conflicts with real accounts.  
- **Testing Strategy**: Leverage both trading hours and 7x24 environments to test under various conditions.  
- **Data Sourcing**: For historical data or advanced analytics, integrate third-party data providers.

