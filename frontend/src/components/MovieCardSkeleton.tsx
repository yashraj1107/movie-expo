const MovieCardSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-700 rounded-xl aspect-[2/3]"></div>
            <div className="mt-3 h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
    );
};
export default MovieCardSkeleton;