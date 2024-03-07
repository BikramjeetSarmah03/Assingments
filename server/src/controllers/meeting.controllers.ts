import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { db } from "../config/db";
import { Request } from "../@types/types";
import { NextFunction, Response } from "express";
import Base64 from "base-64";
import axios from "axios";
import { generatePassword } from "../utils";

export const createMeeting = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // get access token
    const accessToken = await getZoomAccessToken();

    const meetPassword = generatePassword();

    // console.log(req.body);
    console.log(accessToken);

    // const meetingData = {
    //   topic: req.body.topic,
    //   type: req.body.type,
    //   start_time: req.body.start_time,
    //   duration: req.body.duration,
    //   settings: {
    //     join_before_host: true,
    //     password: meetPassword,
    //   },
    // };

    // create meeting link
    // send emails

    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
    });
  }
);

const getZoomAccessToken = async () => {
  try {
    const clientID = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    const credentials = Base64.encode(`${clientID}:${clientSecret}`);

    const params = {
      grant_type: "account_credentials",
      account_id: process.env.ZOOM_ACCOUNT_ID,
    };

    const response = await axios.post("https://zoom.us/oauth/token", params, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.status === 200) {
      return response.data.access_token;
    } else {
      throw new Error("Failed to obtain Zoom access token");
    }
  } catch (error: any) {
    console.log(error);
    console.error("Error obtaining Zoom access token:", error.message);
    throw error;
  }
};
