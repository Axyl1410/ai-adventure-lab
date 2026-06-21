import process from "node:process";

process.env.OPENAI_API_KEY = "";
process.env.IMAGE_API_KEY = "";
delete process.env.OPENAI_BASE_URL;
delete process.env.IMAGE_BASE_URL;
