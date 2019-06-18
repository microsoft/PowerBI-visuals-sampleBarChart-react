// powerbi-visuals-utils-formattingutils
import {
  valueFormatter as vf,
  textMeasurementService as tms
} from "powerbi-visuals-utils-formattingutils";
import valueFormatter = vf.valueFormatter;
import IValueFormatter = vf.IValueFormatter;
import textMeasurementService = tms.textMeasurementService;

// powerbi-visuals-utils-typeutils
import { pixelConverter as PixelConverter } from "powerbi-visuals-utils-typeutils";

import { FONT_SIZE, FONT_FAMILY } from "./constants";

export const getStringLength = (text: string) =>
  textMeasurementService.measureSvgTextWidth({
    text,
    fontFamily: FONT_FAMILY,
    fontSize: PixelConverter.toString(FONT_SIZE)
  });