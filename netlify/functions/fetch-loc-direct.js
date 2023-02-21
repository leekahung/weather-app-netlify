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
    const GEOCODE_API = `https://api.openweathermap.org/geo/1.0/direct?q=${eventBody.locationName}&limit=5&appid=${process.env.API_KEY}`;
    try {
        const response = yield (0, node_fetch_1.default)(GEOCODE_API);
        const data = (yield response.json());
        const locArr = eventBody.locationName
            .toLowerCase()
            .split(",")
            .map((item) => item.trim());
        let likelyLoc;
        switch (locArr.length) {
            case 1:
                likelyLoc = data[0];
                break;
            case 2:
            case 3:
                likelyLoc = data.filter((item) => {
                    var _a;
                    return item.hasOwnProperty("state") &&
                        ((_a = item.state) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === locArr[1];
                })[0];
                if (likelyLoc === undefined) {
                    likelyLoc = data.filter((item) => { var _a; return ((_a = regionName.of(item.country)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === locArr[1]; })[0];
                }
                break;
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                cityName: likelyLoc.name,
                stateName: likelyLoc.state,
                countryName: regionName.of(likelyLoc.country),
                lat: likelyLoc.lat,
                lon: likelyLoc.lon,
            }),
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                errMsg1: "Unable to retrieve location;",
                errMsg2: "Try to include country name.",
            }),
        };
    }
});
exports.handler = handler;
