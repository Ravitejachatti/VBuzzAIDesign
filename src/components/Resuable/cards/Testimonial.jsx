const Testimonial = ({ icon, name, username, testimonial}) =>
{
    return(
        <div className="flex flex-col rounded-2xl bg-white shadow-custom-nav text-black text-center gap-[30px] text-sm max-w-[300px] h-[300px] p-[30px]">
          <div className="flex items-center mb-4">
            <img
              src={icon}
              alt={name}
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <div className="ml-3 text-left">
              <h1 className="text-sm font-semibold">{name}</h1>
              <h6 className="text-xs text-gray-600">@{username}</h6>
            </div>
          </div>
          <p className="text-left text-sm line-clamp-6">{testimonial}</p>
        </div>
    )
}

export default Testimonial