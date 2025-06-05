# 📊 CryptoCap

A simple and elegant **React + TypeScript** app to track your cryptocurrency investments using live data from the [CoinGecko API](https://www.coingecko.com/en/api).  
Search coins, add your holdings in USD, and see live price updates and total portfolio value.

---

## 🚀 Features

- 🔎 **Search** for the top 50 cryptocurrencies by market cap  
- ➕ **Add holdings** by selecting a coin and investing USD amount  
- 💰 **View live prices** and calculate coin amounts based on your investment  
- 📈 **Track total portfolio value** in USD  
- 🔗 URL support for direct linking with coinId query parameter (e.g. `/portfolio?coinId=bitcoin`)  
- 🧩 Clean UI with CSS Modules and React functional components  
- ⚡ Lightweight and fast with minimal dependencies  

---

## 🛠️ Tech Stack

- React (Functional Components + Hooks)  
- TypeScript  
- React Router (`useLocation`, `useNavigate`)  
- CSS Modules for scoped styling  
- CoinGecko API for live crypto data  

---

## 🎯 Usage

1. **Clone the repo:**

   ```bash
   git clone https://github.com/steno1/crypto.git
   cd my-crypto-cap
Install dependencies:


npm install
# or
yarn install
Run the app locally:


npm start
# or
yarn start
Open your browser at http://localhost:3000 and start adding your crypto holdings!

🧩 How it works
On load, the app fetches the top 50 coins by market cap from CoinGecko

You can search coins by name or symbol and select one from the dropdown

Enter the USD amount you've invested and add it to your portfolio

The app fetches live prices and calculates how many coins you own for each holding

Portfolio value updates live with the latest prices



🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.
Please ensure your code follows the existing style and includes relevant tests if applicable.



🙏 Acknowledgments
CoinGecko API for providing free crypto data

Inspired by simple portfolio tracking needs and React best practices
