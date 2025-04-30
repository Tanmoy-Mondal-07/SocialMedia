export default async function profileRecommendationSystem(recommendedUserId) {
    const existingUserIds = JSON.parse(localStorage.getItem("recommendedUserIds")) || []

    if (existingUserIds.length >= 25) existingUserIds.pop()

    if (!existingUserIds.includes(recommendedUserId)) {
        existingUserIds.unshift(recommendedUserId)
        localStorage.setItem("recommendedUserIds", JSON.stringify(existingUserIds))
    }
    // console.log(existingUserIds);

}