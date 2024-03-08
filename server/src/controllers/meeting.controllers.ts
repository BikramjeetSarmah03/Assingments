import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import { db } from "../config/db";
import { Request } from "../@types/types";
import { NextFunction, Response } from "express";
import Base64 from "base-64";
import axios from "axios";
import { generatePassword } from "../utils";
import { sendEmail } from "../utils/sendMail";
import ErrorHandler from "../utils/errorHandler";

export const createMeeting = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { topic, email, date, time, id } = req.body;

    const user = await db.user.findUnique({
      where: {
        id,
        email,
      },
    });

    if (!user) return next(new ErrorHandler("User not found", 404));

    // get access token
    const accessToken = await getZoomAccessToken();

    const meetPassword = generatePassword();

    const meetingData = {
      topic: req.body.topic,
      type: 2,
      start_time: req.body.date,
      duration: req.body.time,
      settings: {
        join_before_host: true,
        password: meetPassword,
      },
    };

    // create meeting link
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingData,
      { headers: headers }
    );

    const meeting = await db.meeting.create({
      data: {
        meetingDate: date,
        meetingDuration: time,
        meetingTopic: topic,
        meetingLink: response.data.join_url,
        meetingStartUrl: response.data.start_url,
        recieverEmail: user.email,
        senderEmail: req.user.email,
      },
    });

    // send emails
    await sendEmail({
      topic,
      to: email,
      duration: time,
      time: date,
      user: user.name || user.username,
      subject: topic,
      joinUrl: response.data.join_url,
      meetingLink: response.data.start_url,
      meetingPassword: meetPassword,
    });

    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      meeting,
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
    console.error("Error obtaining Zoom access token:", error.message);
    throw error;
  }
};
