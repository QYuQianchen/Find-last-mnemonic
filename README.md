# Find the last mnemonic

## Run
Pull the repo or use it with Gitpod. 

When running locally, run:
```
yarn install
yarn start
```

If you are running with Gitpod, no command is needed.

## Insert known mnemonics
By default, the script will choose the first 11 mnenomics words randomly. 

If you've got your 11 words, please concatenate them in a space-separated string, and insert in the `main()` function.
E.g. `"brain shift ability husband into mixed detail dizzy eager seed mechanic"`

The script runs at each change(/save) of the `index.ts` file.

## Test generated mnemonics
Go to (MyEtherWallet)[https://www.myetherwallet.com/wallet/access/software?type=mnemonic] and select "Mnemonic Phrase".
Copy the 12-word space-separated string (without `'`) from the table in console and paste it to the first field in "Step 1 Enter your Mnemonic Phrase". Those words will be parsed by MyEtherWallet.