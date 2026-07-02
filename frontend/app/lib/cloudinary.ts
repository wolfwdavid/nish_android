type CloudinaryUploadResult = {
    secure_url: string
    public_id: string
    width: number
    height: number
    format: string
    resource_type: string
}

export async function uploadToCloudinary(
    file: File
): Promise<CloudinaryUploadResult> {
    const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    const uploadPreset =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName) {
        throw new Error(
            "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
        )
    }

    if (!uploadPreset) {
        throw new Error(
            "Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
        )
    }

    const formData = new FormData()

    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    )

    const data = await response.json()

    if (!response.ok) {
        console.error("Cloudinary error:", data)

        throw new Error(
            data?.error?.message ||
                "Cloudinary upload failed"
        )
    }

    if (!data.secure_url) {
        console.error("Invalid Cloudinary response:", data)

        throw new Error(
            "Cloudinary upload did not return secure_url"
        )
    }

    return data
}