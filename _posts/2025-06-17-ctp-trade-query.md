---
layout: post
title: "CTP - Trading && Query"
author: "chanchan"
categories: journal
tags: [ctp]
image: mountains.jpg
toc: true
---

The CTP API facilitates programmatic trading and data querying for futures markets by providing a structured interface between a client application and the exchange’s counter system (e.g., SimNow servers). The workflow is divided into two main phases: **connection and authentication** (initialization) and **trading and querying** (core operations). The process is asynchronous, relying on callback functions to handle server responses.

- **Trading Workflow**: Involves connecting to the trading front, authenticating, placing orders, and managing order status.
- **Query Workflow**: Involves retrieving account details, positions, and order/trade history.
- **Key Components**: The `ThostFtdcTraderApi` interface handles both trading and querying, using methods like `ReqOrderInsert` and `ReqQryTradingAccount`, with callbacks like `OnRtnOrder` and `OnRspQryTradingAccount`.

The code snippet highlights the initialization phase, which is the foundation for all subsequent trading and query operations.

---

### 2. **Key Knowledge Points of the Trading and Query Workflow**

#### **2.1. Initialization and Connection**
The trading and query process begins with setting up the CTP API and establishing a connection to the SimNow trading front.

- **CreateFtdcTraderApi**:
  - **Purpose**: Initializes the `ThostFtdcTraderApi` instance, the core interface for trading and querying.
  - **Parameters**: Takes a directory path for flow control (e.g., log files) to manage temporary data and prevent overload.
  - **Example**: `CThostFtdcTraderApi* pTraderApi = CThostFtdcTraderApi::CreateFtdcTraderApi("flow_control_dir");`
  - **Knowledge Point**: This step allocates resources and prepares the API for server communication. Ensure the directory exists and is writable.

- **Init**:
  - **Purpose**: Establishes a connection to the trading front server (e.g., `180.168.146.187:10201` for SimNow’s first group).
  - **Process**: The API sends a connection request, triggering the `OnFrontConnected` callback upon success.
  - **Example**: `pTraderApi->Init();`
  - **Knowledge Point**: Call this after setting the front address with `RegisterFront`. Multiple calls may disrupt the connection, so use it once per session.

- **RegisterFront**:
  - **Purpose**: Specifies the trading front address (e.g., `180.168.146.187:10201`) before calling `Init`.
  - **Example**: `pTraderApi->RegisterFront("180.168.146.187:10201");`
  - **Knowledge Point**: Use the correct server group based on testing needs (e.g., 7x24 environment for off-hours testing).

- **OnFrontConnected**:
  - **Purpose**: Callback invoked when the connection to the trading front is successfully established.
  - **Example**: `void OnFrontConnected() { std::cout << "Connected to trading front" << std::endl; }`
  - **Knowledge Point**: This signals the API is ready for authentication. Handle failures (e.g., network issues) by retrying or logging errors.

- **Join**:
  - **Purpose**: Blocks the main thread to allow asynchronous callback processing, ensuring the API remains active.
  - **Example**: `pTraderApi->Join();`
  - **Knowledge Point**: Use this in a single-threaded model. For multi-threaded applications, manage callbacks separately to avoid blocking.

#### **2.2. Authentication**
Authentication is required before trading or querying, using login and optional authentication requests.

- **ReqUserLogin**:
  - **Purpose**: Sends a login request to authenticate the client with the trading front.
  - **Parameters**: Includes `BrokerID` (e.g., `9999` for SimNow), `InvestorID`, and `Password`.
  - **Example**: 
    ```cpp
    CThostFtdcReqUserLoginField loginField = {0};
    strcpy(loginField.BrokerID, "9999");
    strcpy(loginField.InvestorID, "your_investor_id");
    strcpy(loginField.Password, "your_password");
    pTraderApi->ReqUserLogin(&loginField, 0);
    ```
  - **Knowledge Point**: The request ID (e.g., `0`) tracks the request. Success triggers `OnRspUserLogin`; failures trigger `OnRspError`.

- **ReqAuthenticate** (Optional):
  - **Purpose**: Performs an additional authentication step, often for security or specific exchange requirements.
  - **Parameters**: Includes `BrokerID`, `InvestorID`, and an authentication code (default `0000000000000000` for SimNow).
  - **Example**: 
    ```cpp
    CThostFtdcReqAuthenticateField authField = {0};
    strcpy(authField.BrokerID, "9999");
    strcpy(authField.InvestorID, "your_investor_id");
    strcpy(authField.AuthCode, "0000000000000000");
    pTraderApi->ReqAuthenticate(&authField, 0);
    ```
  - **Knowledge Point**: Triggered by `OnRspAuthenticate`. This step can be skipped if terminal authentication is disabled in SimNow settings.

- **OnRspAuthenticate**:
  - **Purpose**: Callback for authentication response, indicating success or failure.
  - **Example**: `void OnRspAuthenticate(CThostFtdcRspAuthenticateField *pRspAuthenticate, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) { ... }`
  - **Knowledge Point**: Check `pRspInfo->ErrorID` for errors (e.g., `0` indicates success). Proceed to `ReqUserLogin` if required.

- **OnRspUserLogin**:
  - **Purpose**: Callback for login response, providing session details (e.g., trading day, session ID).
  - **Example**: `void OnRspUserLogin(CThostFtdcRspUserLoginField *pRspUserLogin, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) { ... }`
  - **Knowledge Point**: A `ErrorID` of `0` confirms login success. Use the returned `SessionID` for subsequent requests.

#### **2.3. Trading Workflow**
After authentication, the API enables order placement and management.

- **ReqOrderInsert**:
  - **Purpose**: Submits a new order to the trading front.
  - **Parameters**: Includes `InstrumentID`, `OrderPriceType` (e.g., limit), `Direction` (buy/sell), `LimitPrice`, and `VolumeTotalOriginal`.
  - **Example**: 
    ```cpp
    CThostFtdcInputOrderField orderField = {0};
    strcpy(orderField.InstrumentID, "cu2312");
    orderField.OrderPriceType = THOST_FTDC_OPT_LimitPrice;
    orderField.Direction = THOST_FTDC_D_Buy;
    orderField.LimitPrice = 50000.0;
    orderField.VolumeTotalOriginal = 1;
    pTraderApi->ReqOrderInsert(&orderField, 1);
    ```
  - **Knowledge Point**: SimNow supports limit, FAK, and FOK orders; market orders are not supported. Success triggers `OnRspOrderInsert`; updates trigger `OnRtnOrder`.

- **ReqOrderAction**:
  - **Purpose**: Modifies or cancels an existing order.
  - **Parameters**: Includes `OrderRef`, `FrontID`, and `SessionID` from the original order.
  - **Example**: 
    ```cpp
    CThostFtdcInputOrderActionField actionField = {0};
    strcpy(actionField.OrderRef, "your_order_ref");
    actionField.FrontID = your_front_id;
    actionField.SessionID = your_session_id;
    actionField.ActionFlag = THOST_FTDC_AF_Delete;
    pTraderApi->ReqOrderAction(&actionField, 2);
    ```
  - **Knowledge Point**: Use `OnRtnOrder` to monitor status changes (e.g., canceled, partially filled).

- **OnRtnOrder**:
  - **Purpose**: Callback for order status updates (e.g., pending, filled, canceled).
  - **Example**: `void OnRtnOrder(CThostFtdcOrderField *pOrder) { ... }`
  - **Knowledge Point**: Check `OrderStatus` to determine the current state (e.g., `THOST_FTDC_OST_Canceled`).

- **OnRtnTrade**:
  - **Purpose**: Callback for trade confirmations when an order is fully or partially executed.
  - **Example**: `void OnRtnTrade(CThostFtdcTradeField *pTrade) { ... }`
  - **Knowledge Point**: Provides trade details (e.g., price, volume), essential for position tracking.

#### **2.4. Query Workflow**
Queries retrieve account, position, and historical data after authentication.

- **ReqQryTradingAccount**:
  - **Purpose**: Queries account balance, margin, and available funds.
  - **Example**: 
    ```cpp
    CThostFtdcQryTradingAccountField accountField = {0};
    strcpy(accountField.BrokerID, "9999");
    strcpy(accountField.InvestorID, "your_investor_id");
    pTraderApi->ReqQryTradingAccount(&accountField, 3);
    ```
  - **Knowledge Point**: Response via `OnRspQryTradingAccount`; use for risk management.

- **ReqQryInvestorPosition**:
  - **Purpose**: Retrieves open positions for specific instruments.
  - **Example**: 
    ```cpp
    CThostFtdcQryInvestorPositionField posField = {0};
    strcpy(posField.BrokerID, "9999");
    strcpy(posField.InvestorID, "your_investor_id");
    strcpy(posField.InstrumentID, "cu2312");
    pTraderApi->ReqQryInvestorPosition(&posField, 4);
    ```
  - **Knowledge Point**: Response via `OnRspQryInvestorPosition`; check `Position` and `YdPosition` (yesterday’s position).

- **ReqQryOrder** and **ReqQryTrade**:
  - **Purpose**: Queries order and trade history.
  - **Example**: 
    ```cpp
    CThostFtdcQryOrderField orderField = {0};
    strcpy(orderField.BrokerID, "9999");
    strcpy(orderField.InvestorID, "your_investor_id");
    pTraderApi->ReqQryOrder(&orderField, 5);
    ```
  - **Knowledge Point**: Responses via `OnRspQryOrder` and `OnRspQryTrade`; useful for auditing and strategy evaluation.

- **OnRspQryTradingAccount**, **OnRspQryInvestorPosition**, etc.:
  - **Purpose**: Callbacks for query responses, providing detailed data.
  - **Example**: `void OnRspQryTradingAccount(CThostFtdcTradingAccountField *pAccount, CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) { ... }`
  - **Knowledge Point**: `bIsLast` indicates the end of multi-packet responses; `ErrorID` checks for errors.

#### **2.5. Error Handling**
- **OnRspError**:
  - **Purpose**: General error callback for failed requests.
  - **Example**: `void OnRspError(CThostFtdcRspInfoField *pRspInfo, int nRequestID, bool bIsLast) { ... }`
  - **Knowledge Point**: `ErrorID != 0` indicates an issue (e.g., invalid credentials); log and retry if appropriate.

- **OnErrRtnOrderInsert**:
  - **Purpose**: Specific error callback for order submission failures.
  - **Example**: `void OnErrRtnOrderInsert(CThostFtdcInputOrderField *pInputOrder, CThostFtdcRspInfoField *pRspInfo) { ... }`
  - **Knowledge Point**: Common errors include price limit violations or insufficient margin.

#### **2.6. Operational Considerations**
- **Server Groups**: Use appropriate SimNow servers (e.g., `180.168.146.187:10201` for trading hours, `10130` for 7x24) based on testing needs.
- **Rate Limits**: Limit requests to ~1 every 2 seconds to avoid restrictions.
- **Trading Hours**: Align testing with SimNow’s schedule (e.g., 9:00 AM–3:00 PM and 9:00 PM–2:30 AM HKT, unavailable weekends/holidays).
- **SimNow Limitations**: No market orders, no historical data, and the 7x24 environment lacks settlement.

---

### 3. **Practical Workflow**
1. **Initialize API**: Call `CreateFtdcTraderApi` and `RegisterFront`.
2. **Connect**: Use `Init` and wait for `OnFrontConnected`.
3. **Authenticate**: Send `ReqAuthenticate` (if required) and `ReqUserLogin`, verify with `OnRspAuthenticate` and `OnRspUserLogin`.
4. **Trade**: Submit orders with `ReqOrderInsert`, manage with `ReqOrderAction`, and monitor via `OnRtnOrder` and `OnRtnTrade`.
5. **Query**: Retrieve data with `ReqQryTradingAccount`, `ReqQryInvestorPosition`, etc., and process via respective callbacks.
6. **Handle Errors**: Use `OnRspError` and `OnErrRtnOrderInsert` to debug issues.
7. **Cleanup**: Call `Release` when done to free resources.

---

### 4. **Key Considerations**
- **Testing**: Use SimNow’s first group during trading hours for real-time data; 7x24 for off-hours testing.
- **Security**: Use unique credentials to avoid real account conflicts.
- **Debugging**: Monitor logs in the flow control directory and use `telnet` to verify connectivity.
- **Transition**: Update server addresses and credentials for real trading after testing.
