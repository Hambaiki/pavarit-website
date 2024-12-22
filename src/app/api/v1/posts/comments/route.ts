import { NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/lib/db/comments";

import {
  CommonResponse,
  CreateCommentResponse,
  GetCommentsResponse,
  UpdateCommentResponse,
} from "@/types/api/common";

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // Per 60 seconds
});

export async function PUT(request: Request) {
  try {
    try {
      const ip = request.headers.get("x-forwarded-for") || "";
      await rateLimiter.consume(ip);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests",
        } as CreateCommentResponse,
        { status: 429 }
      );
    }

    const body = await request.json();

    const comment = await createComment({
      postId: body.post_id,
      userId: body.user_id,
      content: body.content,
    });

    return NextResponse.json({
      success: true,
      message: "Comment created",
      comment: comment,
    } as CreateCommentResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        comment: null,
      } as CreateCommentResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const comment = await deleteComment(body.id);
    return NextResponse.json({
      success: true,
      message: "Comment deleted",
      comment,
    } as CommonResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        comment: null,
      } as CommonResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId } = body;
    const comments = await getComments({ postId });

    return NextResponse.json({
      success: true,
      message: "Comments fetched",
      comments,
    } as GetCommentsResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        comments: [],
      } as GetCommentsResponse,
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const comment = await updateComment(body);
    return NextResponse.json({
      success: true,
      message: "Comment updated",
      comment: comment,
    } as UpdateCommentResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        comment: null,
      } as UpdateCommentResponse,
      { status: 500 }
    );
  }
}
