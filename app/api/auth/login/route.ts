import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log("[v0] Login request:", body);

    const response = await fetch(
      "https://verne-be.v0stdio.workers.dev/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log("[v0] Backend response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("[v0] Backend error:", errorData);
      return NextResponse.json(errorData || { error: "Login failed" }, {
        status: response.status,
      });
    }

    const data = await response.json();
    console.log("[v0] Login successful");
    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
