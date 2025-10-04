const MentorCard = ({backgroundColor, textColor, image, name, designation}) => {
    return (
        <div className="max-w-[250px] h-[410px] rounded-[30px]"
        style={{ backgroundColor: backgroundColor, color: textColor }}
        >
            <div className="flex flex-col items-center pt-[80px] px-4">
                <h2 className="font-bold text-lg">{name}</h2>
                <p className="text-sm font-medium">{designation}</p>
            </div>
            <div className="px-[50px] justify-end mt-[30px]">
                <img
                src={image}
                alt={name}
                className="w-full h-[250px] object-cover shrink-0"
            />
            </div>
        </div>
    )
}

export default MentorCard