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
const regionName = new Intl.DisplayNames(["en"], { type: "region" });
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const eventBody = JSON.parse(event.body);
    const GEOCODE_API = `https://api.openweathermap.org/geo/1.0/reverse?lat=${eventBody.lat}&lon=${eventBody.lon}&appid=${process.env.API_KEY}`;
    const response = yield (0, node_fetch_1.default)(GEOCODE_API);
    const data = (yield response.json());
    return {
        statusCode: 200,
        body: JSON.stringify({
            cityName: data[0].name,
            stateName: data[0].state,
            countryName: regionName.of(data[0].country),
        }),
    };
});
exports.handler = handler;
