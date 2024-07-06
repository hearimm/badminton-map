import { Button } from "@/components/ui/button";
import { format } from 'date-fns';


interface DateButtonProps {
    date: Date | number | string;
    isSelected: boolean;
    onClick: () => void;
}


const DateButton = ({ date, isSelected, onClick }: DateButtonProps) => (
    <Button
        variant={isSelected ? "default" : "ghost"}
        className={`flex-col items-center justify-center h-16 ${isSelected ? 'bg-black text-white' : ''}`}
        onClick={onClick}
    >
        <div className="text-sm">{format(date, 'E')}</div>
        <div className="text-lg font-bold">{format(date, 'd')}</div>
    </Button>
);

export default DateButton;