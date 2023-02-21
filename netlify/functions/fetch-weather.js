"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const eventBody = JSON.parse(event.body);
    const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?lat=${eventBody.lat}&lon=${eventBody.lon}&appid=${process.env.API_KEY}&units=imperial`;
    const response = yield (0, node_fetch_1.default)(WEATHER_API);
    const data = (yield response.json());
    return {
        statusCode: 200,
        body: JSON.stringify({
            tempCurrent: data.main.temp,
            tempHigh: data.main.temp_max,
            tempLow: data.main.temp_min,
            weatherCondition: data.weather[0].main,
            weatherDescript: data.weather[0].description,
            conditionCode: data.weather[0].id,
            timeInfo: data.timezone,
        }),
    };
});
exports.handler = handler;
