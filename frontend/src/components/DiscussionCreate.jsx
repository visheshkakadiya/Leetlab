import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { createDiscussion, getAllDiscussions } from '@/store/Slices/discussionSlice'
import { marked } from 'marked'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function DiscussionCreate() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const avatar = useSelector((state) => state.auth?.user?.imageUrl);
    const userData = useSelector((state) => state.auth?.user);

    const [content, setContent] = useState('')

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            content: ''
        }
    });

    const handleContentChange = (value) => {
        setContent(value || "");
        setValue("content", value || "");
    };

    const handlePostDiscussion = (data) => {
        const { title, content } = data;
        
        if (!title || !content) {
            toast.error("Please fill all the fields")
            return
        }

        const contentHtml = marked(content)
        const payload = {
            title,
            contentHtml
        }

        dispatch(createDiscussion(payload))
        dispatch(getAllDiscussions())
        
        reset();
        setContent('');
        navigate('/discuss')
    };

    return (
        <>
            <Toaster
                position="bottom-right"
                reverseOrder={true}
                toastOptions={{
                    error: {
                        style: { borderRadius: "0", color: "red" },
                    },
                    success: {
                        style: { borderRadius: "0", color: "green" },
                    },
                    duration: 2000,
                }}
            />
            <div className="w-full min-h-[calc(100vh-50px)] flex flex-col items-center py-10 bg-black">
                <div className="w-full max-w-7xl bg-neutral-900 rounded-lg relative">
                    
                    <button
                        type="button"
                        onClick={() => navigate('/discuss')}
                        className="absolute cursor-pointer top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm">Back</span>
                    </button>

                    <form onSubmit={handleSubmit(handlePostDiscussion)} className="pt-12">
                        <div className="px-4 py-4 flex items-center gap-3">
                            {/* Avatar */}
                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                                {avatar ? (
                                    <img 
                                        src={avatar} 
                                        alt="User" 
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-black font-semibold text-lg">
                                        {userData?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                {/* Title Input */}
                                <input
                                    placeholder="Title"
                                    className="border-0 text-xl w-full h-12 px-4 py-2 text-white bg-transparent focus:outline-none focus:ring-0 placeholder-gray-400"
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="text-sm px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors"
                                    onClick={() => {
                                        reset();
                                        setContent('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                >
                                    Post
                                </button>
                            </div>
                        </div>

                        <div data-color-mode="dark">
                            <MDEditor
                                height={600}
                                preview="live"
                                className="rounded-lg shadow-lg"
                                value={content}
                                onChange={handleContentChange}
                            />
                            {errors.content && (
                                <p className="text-red-500 text-sm px-4 pb-2">{errors.content.message}</p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default DiscussionCreate
