import React from 'react'

function Issue() {
    return (
        <div className=''>
            <div className='flex w-full h-full min-h-screen bg-slate-50 justify-between px-10'>
                <div className='w-[45%] min-h-screen bg-black'></div>
                <div className='flex md:flex-col w-[65%] min-h-screen  bg-slate-100 items-center justify-center'>
                    <div className='flex w-full flex-col items-center justify-center p-10'>
                        <div className='text-[60px] max-w-[70%] text-black font-semibold text-center '>Some random text for Issue form</div>
                        <div className='text-[20px] max-w-[70%] text-black font-light text-center '>Some random text for Issue form with more stuff ig</div>
                    </div>
                    <div className="flex w-[80%] mx-auto items-center justify-between ">
                        <div className='flex w-[45%] flex-col'>
                            <div className="flex  text-[20px] text-black font-extralight justify-start my-2">Issuer Name</div>
                            <input className='flex  p-3 rounded-lg' id='email' type='email' aria-label='email address' />
                        </div>
                        <div className='flex w-[45%] flex-col'>
                            <div className="flex  text-[20px] text-black font-extralight justify-start my-2">Event Id</div>
                            <input className='flex  p-3 rounded-lg' id='email' type='email' aria-label='email address' />
                        </div>
                    </div>
                    <div className="flex w-[80%] mx-auto items-center justify-between ">
                        <div className='flex w-[45%] flex-col'>
                            <div className="flex  text-[20px] text-black font-extralight justify-start my-2">Recipient Name</div>
                            <input className='flex  p-3 rounded-lg' id='email' type='email' aria-label='email address' />
                        </div>
                        <div className='flex w-[45%] flex-col'>
                            <div className="flex  text-[20px] text-black font-extralight justify-start my-2">Adhaar Number</div>
                            <input className='flex  p-3 rounded-lg' id='email' type='email' aria-label='email address' />
                        </div>
                    </div>
                    <div className="flex w-[80%] mx-auto items-center justify-between ">
                        <div className='flex w-[45%] flex-col'>
                            <div className="flex  text-[20px] text-black font-extralight justify-start my-2">Event Name</div>
                            <input className='flex  p-3 rounded-lg' id='email' type='email' aria-label='email address' />
                        </div>
                        <div className='flex w-[45%] flex-col'>
                            <div className="flex  text-[20px] text-black font-extralight justify-start my-2">Date of Isuue</div>
                            <input className='flex  p-3 rounded-lg' id='email' type='email' aria-label='email address' />
                        </div>
                    </div>
                    <div className="flex w-[80%] mx-auto items-center justify-between py-5">
                        <div className="w-[45%] rounded-md bg-orange-600 p-3 text-white text-[20px] font-light text-center hover:bg-orange-700 hover:cursor-pointer">Connect Wallet</div>
                        <button className="w-[45%] rounded-md bg-black p-3 text-white text-[20px] font-light text-center hover:bg-slate-900 hover:cursor-pointer" disabled>Issue</button>
                    </div>
                    <div className='text-black'>smthn</div>
                </div>
            </div>
        </div>
    )
}

export default Issue;