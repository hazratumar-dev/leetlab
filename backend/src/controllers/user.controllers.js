import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiRsponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { UserRoleEnum } from "../utils/constant.js";

const generateAccessAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating the access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // take the data
  // validate the data
  // check in the database
  // validate then
  // create the new user
  // put the token in the emailVerificationToken and also the expiry
  // save the user in the database
  // send email to the user

  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "user already exist with this email or username");
  }

  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
    role: UserRoleEnum.ADMIN,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateRandomToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();

  // here is the email sender code

  const createdUser = await User.findById(user?._id).select(
    "-password -emailVerificationToken -refreshToken -emailVerificationExpiry"
  );

  return res
    .status(201)
    .json(new ApiRsponse(201, { createdUser }, "user register successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credential");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new ApiRsponse(200, loggedInUser, "user logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(204)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiRsponse(204, {}, "user logout successfully"));
});

const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiRsponse(200, req.user, "Current user fetched successfully"));
});

export { registerUser, loginUser, logOutUser, getMe };
