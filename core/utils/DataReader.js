/**
 * DataReader utility for the framework
 * @author Jeyaram K
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const properties = require('properties-reader');
const dotenv = require('dotenv');
const CryptoJS = require('crypto-js');

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

class DataReader {
    constructor() {}

    decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    async readJson(filePath, encrypted = false) {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        if (encrypted) {
            for (const key in jsonData) {
                if (typeof jsonData[key] === 'string') {
                    jsonData[key] = this.decrypt(jsonData[key]);
                }
            }
        }
        return jsonData;
    }

    async readCsv(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    async readExcel(filePath, sheetName) {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(sheet);
    }

    readProperties(filePath) {
        return properties(filePath);
    }

    getEnv(key) {
        return process.env[key];
    }
}

export default new DataReader();