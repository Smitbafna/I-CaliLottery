# I-CaliLottery: Decentralized Lottery Platform for DAOs, Fundraisers, and Entertainment

**I-CaliLottery** is a decentralized Web3 lottery platform built on **Calimero** and **ICP**. It enables **DAOs**, **fundraisers**, and **entertainment platforms** to create **transparent**, **secure**, and **privacy-preserving** lottery systems. Powered by **ICP smart contracts** and **Calimero’s** decentralized infrastructure, I-CaliLottery revolutionizes the way lotteries and raffles are conducted.

---

## 🚀 Key Features

### 🎫 **Lottery Creation & Participation**
- Custom lottery categories for **DAOs**, **fundraisers**, and **entertainment platforms**.
- Flexible ticket purchasing system with easy participation.
- **Commit-Reveal Phase** to ensure complete privacy for participants until the lottery draw.

### 🔐 **Secure & Auditable Random Number Generation (RNG)**
- Leveraging **ICP smart contracts** for auditable RNG, ensuring fairness and transparency.
- Verification hash (`sha256`) for each lottery run, ensuring tamper-proof integrity.
- **Auditability** of winner index, lottery ID, and winner ID.

### 💰 **Encrypted Prize Pools**
- Fully **encrypted prize pools** for privacy until the lottery concludes.
- Dynamic prize pool sizes that adjust based on participant count and ticket size.

### 🏆 **Reward Distribution**
- **60% to Winners**: Major portion of the prize pool goes to winners.
- **30% to DAOs/Platforms**: Supporting ecosystem growth and platform incentives.
- **10% for Maintenance**: Reserved for the platform's sustainability and security.

### 🕵️‍♂️ **Calimero Integration for Privacy**
- End-to-end anonymity for participants, from ticket purchase to prize distribution.
- Leverages **Calimero** to ensure privacy and protect participant data from third parties.

---

## 🌐 Live Demo

Experience the full potential of **I-CaliLottery** by exploring the platform live:

👉 [Explore the Platform](#)

---

## 🏗 Architecture

### **Frontend Stack**
- **React** + **Vite**: A seamless UI framework for smooth, fast interactions.
- **TailwindCSS**: Modern styling for a **responsive** design.
- **hero-ui**: A comprehensive component library for consistency across UI elements.

### **Backend Infrastructure**
- **ICP Smart Contracts**: Ensuring secure and auditable random number generation for lottery operations.
- **Calimero**: Privacy-focused solution for participant anonymity throughout the lottery process.

---

## 🛠 Installation

To run this project locally, follow the steps below:

### Prerequisites
1. Ensure you have [Node.js](https://nodejs.org/) installed (v14.x.x or later).
2. Make sure you have [ICP](https://internetcomputer.org/) environment set up.
3. Ensure that **Calimero** is integrated in your project.

   
# I-CaliLottery Setup Guide

Follow these steps to clone, set up, and deploy the I-CaliLottery project.

### 1. Clone the repository:

```bash
git clone https://github.com/yourusername/I-CaliLottery.git
cd I-CaliLottery
```
### 2. Set up the `dfx` environment:

Follow the setup instructions on the [Calimero Network Tutorials](https://calimero-network.github.io/tutorials/awesome-projects/building-with-icp/).


### 3. Install dependencies:

```bash
cd icp-devnet/app
pnpm install
```
### 4. Run the server:

```bash
pnpm run dev
```





