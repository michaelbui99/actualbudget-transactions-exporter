# Actual Budget Exporter
The CLI tool authenticates to your ActualBudget instance and exports all transactions for a given account to a JSON file.

## Requirements
- Node 22.17+

## Setup
Clone the repo
```console
$ git clone git@github.com:michaelbui99/actualbudget-transactions-exporter.git
```
Navigate to the cloned directory
```console
$ cd ./actualbudget-transactions-exporter
```

Run `npm install`
```console
$ npm install
```
Run `npm run setup`
```console
$ npm run setup
```

Verify that the tool has been setup correctly by running: 
```console
$ actual-transactions-exporter --version
```

## Usage
By default, if you run the tool without providing any options, then it will run in interactive mode.

```console
$ actual-transactions-exporter 
```

If you want to use the tool in scripts, pass options when using the tool in order to not be prompted: 
```console
$ actual-transactions-exporter  --url 'https://actual.michaelbui.dk' --password 'MY_PASSWORD' --syncId 'feb96563-67fd-4fb1-859f-b1304c004f1a' --accountId 'SOME_ACCOUNT_ID' --outDir './transactions' -y
``` 


