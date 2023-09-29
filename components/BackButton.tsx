import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';

function BackButton({url, disabled}: {url: string, disabled?: boolean}) {
    const router = useRouter();
    return (
        <Button disabled={disabled} onClick={()=> {router.push(url)}} className="absolute left-1 top-0 m-1" variant="outline" size="icon">
            <ArrowLeft className="h-[1.2rem] w-[1.2rem]" />
        </Button>
    )
}

export default BackButton