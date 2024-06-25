// src/config.ts
import express from 'express';
import path from 'path';

export const http_Host = "192.168.15.158";
export const http_Port = 80;
export const public_Dir = path.join(process.cwd(), "src", "Publik");
export const main_Scope = express();
export const router_Scope = express.Router();
