# Balancing Prices in Uniswap Pools

## Description

This project is designed to automatically align prices in Uniswap liquidity pools. The program uses trading data (ticks)
to calculate optimal prices and make adjustments in the pools. This helps in maintaining price balance and ensures more
efficient liquidity distribution.

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v16.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository to your local machine.

```sh 
git clone https://github.com/rolik2001/uniswap-pool-balancer
```

2. Navigate to the project directory.

```sh
   cd uniswap-pool-balancer
 ```

3. Install the required dependencies.
```sh
   npm install
```

## Configuration

Before running the application, configure the environment and settings:

- Create a `.env` file in the root directory and set your environment-specific variables (for example use example.eenv).
- Adjust the `config.json` file in the root directory to specify the Uniswap pools to monitor (template located at config-template.json)

## Usage

To start the application, run:
```sh
node app.js
```

## NOTE
At present, this project employs workerThreads to manage different currency pairs. In the future, it is planned to transition to using pm2 for enhanced process management. Additionally, the development of a robust error handling system is also on the roadmap to ensure smoother operation and reliability.