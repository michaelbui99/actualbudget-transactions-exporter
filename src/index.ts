#!/usr/bin/env node

import * as api from '@actual-app/api';
import * as fs from "fs";
import * as path from "path";
import { program } from "commander"
import { password as promptPassword, input, select, confirm } from "@inquirer/prompts"
import chalk from 'chalk';
import { format } from "date-fns"

program
    .version("0.1.0")
    .description("Export transactions from account")
    .option("--url <url>", "Actual server URL")
    .option("--password <password>", "password")
    .option("--syncId <syncId>", "Budget sync ID")
    .option("--accountId <accountId>", "Account ID")
    .option("--outDir <outDir>", "Where to output the transactions file")
    .option("-y, --yes", "Accept export of transactions")
    .action(async (options) => {
        let password: string = options.password || await promptPassword({ message: "ActualBudget password" });
        let url: string = options.url || await input({ message: "ActualBudget server URL" }) || "https://actual.michaelbui.dk";
        let syncId: string = options.syncId || await input({ message: "Budget sync ID" }) || "feb96563-67fd-4fb1-859f-b1304c004f1a";

        await api.init({
            serverURL: url,
            password: password,
        });
        await api.downloadBudget(syncId);

        const accounts = await api.getAccounts() || [];
        if (accounts.length == 0) {
            console.log(chalk.yellow("No accounts available. Exiting..."))
            await api.shutdown();
            return;
        }

        const accountId = options.accountId || await select({
            message: "Select account",
            choices: accounts.map(account => {
                return {
                    name: account.name,
                    value: account.id,
                }
            })
        });

        const transactions = await api.getTransactions(accountId, '1999-01-01', '3000-12-12');
        console.log(chalk.blue(`${transactions.length} transactions has been retrieved`));

        let exportFileName = `${accountId}-${format(new Date(), "yyyy-MM-dd")}.json`;
        let validExportPath = undefined;
        if (options.outDir) {
            let resolvedExportPath = path.resolve(options.outDir);
            if (!fs.statSync(resolvedExportPath).isDirectory()) {
                console.log(chalk.red("Provided path is not a directory. Exitting..."))
                return;
            } else {
                validExportPath = path.join(resolvedExportPath, exportFileName);
            }
        } else {
            while (!validExportPath) {
                const exportPath = await input({ message: "Which directory should the transactions be exported to?" });
                let resolvedExportPath = path.resolve(exportPath);
                if (!fs.statSync(resolvedExportPath).isDirectory()) {
                    console.log(chalk.red("Provided path is not a directory."))
                } else {
                    validExportPath = path.join(resolvedExportPath, exportFileName);
                }
            }
        }

        const doExport = options.yes || await confirm({ message: chalk.black(`Export ${transactions.length} transactions to ${validExportPath}?`) });
        if (doExport) {
            fs.writeFileSync(validExportPath, JSON.stringify(transactions), "utf8");
            console.log(chalk.green(`Transactions has been exported to ${validExportPath}!`));
        }

        await api.shutdown();
    })

program.parse(process.argv);
