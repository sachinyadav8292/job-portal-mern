import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(
                `${USER_API_END_POINT}/logout`,
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(setUser(null));
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    return (
        <div className='bg-white shadow-sm'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>

                {/* Logo */}
                <h1 className='text-2xl font-bold'>
                    Job<span className='text-[#F83002]'>Portal</span>
                </h1>

                <div className='flex items-center gap-8'>

                    {/* Menu Links */}
                    <ul className='flex font-medium items-center gap-6'>
                        {
                            user?.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>

                    {/* Auth Section */}
                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login">
                                    <Button variant="outline">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto || ""}
                                        />
                                        <AvatarFallback>
                                            {user?.fullname?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>

                                <PopoverContent className="w-72">
                                    <div className='space-y-3'>

                                        <div className='flex gap-3 items-center'>
                                            <Avatar>
                                                <AvatarImage
                                                    src={user?.profile?.profilePhoto || ""}
                                                />
                                                <AvatarFallback>
                                                    {user?.fullname?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h4 className='font-semibold'>
                                                    {user?.fullname}
                                                </h4>
                                                <p className='text-sm text-gray-500'>
                                                    {user?.profile?.bio || "No bio added"}
                                                </p>
                                            </div>
                                        </div>

                                        {user?.role === 'student' && (
                                            <div className='flex items-center gap-2 cursor-pointer'>
                                                <User2 size={18} />
                                                <Link to="/profile" className='text-sm'>
                                                    View Profile
                                                </Link>
                                            </div>
                                        )}

                                        <div
                                            onClick={logoutHandler}
                                            className='flex items-center gap-2 cursor-pointer text-red-500'
                                        >
                                            <LogOut size={18} />
                                            <span className='text-sm'>Logout</span>
                                        </div>

                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Navbar