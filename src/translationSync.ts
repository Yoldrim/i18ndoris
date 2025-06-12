#! /usr/bin/env node

//                relative path to scan files
// USAGE: npx i18ndoris-update <root of scan> <translation files>
// EXAMPLE: npx i18ndoris-update ./src ./translations

// @ts-ignore
import { Message } from "./interfaces";

import fs from 'fs';
import path from 'path';

import {
    createKeyWithContextString,
    createKeyFromString,
    createHashWithContextString,
    createHashFromString
} from './util';
import {readFileJSON, writeFileJSON} from './fsUtils';

const flatten = (lists: any[]) => lists.reduce((a, b) => a.concat(b), []);

const getDirectories = (srcPath: string) => {
    return fs.readdirSync(srcPath)
        .map((file: string) => path.join(srcPath, file))
        .filter((p: string) => fs.statSync(p).isDirectory());
};

const getDirectoriesRecursive = (src: string): string[] => {
    return [src, ...flatten(getDirectories(src).map(getDirectoriesRecursive))];
};

const getAllFilesFromRoot = (srcPath: string, fileTypes: string[]) => {
    let files: string[] = [];
    const directories = getDirectoriesRecursive(srcPath);
    for (let dir of directories) {
        fs.readdirSync(dir, {withFileTypes: true})
            .filter((item: any) => {
                if (item.isDirectory()) {
                    return false;
                }

                const fnSplit = item.name.split('.');
                return fileTypes.includes(fnSplit[fnSplit.length - 1]);
            })
            .forEach((item: any) => files.push(`${item.path}/${item.name}`));
    }
    return files;
}

const getMessagesFromFile = (filePath: string): Message[] => {
    const file = fs.readFileSync(filePath, 'utf8');
    const fileSplit = file.split('\n');
    const translationRegex = /[^a-zA-Z0-9](t|ct)\(['"`].*['"`].*\)/;
    let translationLineIndices: number[] = [];

    fileSplit.forEach((line: string, index: number) => {
        // messy, matches all t('') and ct('') instances with additional checks
        const regex = new RegExp(translationRegex, 'g');
        if (line.match(regex)) {
            translationLineIndices.push(index);
        }
    });

    const messages: Message[] = [];
    translationLineIndices.forEach((indice) => {
        const regMatch = fileSplit[indice].match(/[^a-zA-Z0-9](t|ct)\(['"`].*['"`].*\)/g)
        // @ts-ignore
        if (regMatch[0][1] === 'c') {
            let message: string = fileSplit[indice]
                .split(/t\(['"`]/)[1]
                .split(/['"`]\)/)[0]
                .replace(/['"`]/g, '')

            let messageSplit;
            if (message.includes('{{') && message.includes('}}')) {
                messageSplit =  message.split(',').slice(0, -1);
                messageSplit = [messageSplit[0], messageSplit.slice(1).join(',').trim()]
            } else {
                messageSplit = message.split(',')
                messageSplit = [messageSplit[0], messageSplit.slice(1).join(',').trim()]
            }
            if (!messages.find((x) => x.hash === createHashWithContextString(messageSplit[0], messageSplit[1]))) {
                messages.push({
                    id: createKeyWithContextString(messageSplit[0], messageSplit[1]),
                    hash: createHashWithContextString(messageSplit[0], messageSplit[1]),
                    defaultMessage: messageSplit[1]
                })
            }
        } else {
            let message = fileSplit[indice]
            .split(/t\(['"`]/)[1]
            .split(/['"`]\)/)[0]
            .replace(/['"`]/g, '');

            if (message.includes('{{') && message.includes('}}')) {
                message = message.split(',').slice(0, -1).join(',');
            }

            if (!messages.find((x) => x.hash === createHashFromString(message))) {
                messages.push({
                    id: createKeyFromString(message),
                    hash: createHashFromString(message),
                    defaultMessage: message
                });
            }
        }
    });
    return messages;
};

const addMessages = (translationFilePath: string, messages: Message[]) => {
    if (messages === undefined) return;
    const jsonMessages: Message[] = readFileJSON(translationFilePath);
    const newMessages = [];

    for (let message of messages) {
        if (jsonMessages.find((obj) => obj.id === message.id) === undefined) {
            newMessages.push(message);
        }
    }

    if (newMessages.length > 0) {
        console.log(`Writing ${newMessages.length} new message(s) to ${translationFilePath}.`);
        writeFileJSON(translationFilePath, [...jsonMessages, ...newMessages]);
    }
};

// @ts-ignore
const srcPath = path.join(process.env.INIT_CWD, process.argv[2]);
// @ts-ignore
const translationsPath = path.join(process.env.INIT_CWD, process.argv[3]);
const files = getAllFilesFromRoot(srcPath, ['js', 'jsx', 'ts', 'tsx']);
let messages = [];

for(let fileName of files) {
    messages.push(...getMessagesFromFile(fileName));
}

const translationFiles = getAllFilesFromRoot(translationsPath, ['json']);
for(let fileName of translationFiles) {
    addMessages(fileName, messages);
}
