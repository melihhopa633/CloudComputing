 blockchainservice:
    build: ./backend/BlockchainService
    depends_on:
      - blockchain-node
    environment:
      RPC_URL: http://blockchain-node:8545
      MNEMONIC: "test test test test test test test test test test test junk"
    ports:
      - "4000:4000"
    networks:
      - app-network