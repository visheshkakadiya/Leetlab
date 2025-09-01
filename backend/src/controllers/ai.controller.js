import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { getChat, getComplexity } from '../utils/AiAgent.js'

const getComplexities = asyncHandler(async (req, res) => {
    const { sourceCode } = req.body;
    
    if (!sourceCode) {
        throw new ApiError(400, "Code is required");
    }

    const complexity = await getComplexity(sourceCode);

    res.status(200).json(
        new ApiResponse(200, complexity, "Complexity fetched successfully")
    )
})

const getChats = asyncHandler(async (req, res) => {
    const {message, context} = req.body;

    const response = await getChat(message, context);

    res.status(200).json(
        new ApiResponse(200, response, "Chat fetched successfully")
    )
})

export {
    getComplexities,
    getChats
}