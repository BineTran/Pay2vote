type SpecialAddButtonProps = {
	openModal: () => void;
	children: React.ReactNode;
};

export const SpecialAddButton = ({ openModal, children }: SpecialAddButtonProps) => {
	return (
		<button
			type="button"
			onClick={openModal}
			className="rounded-md w-full h-full  text-favoriteGray/50 border-4 border-dashed border-favoriteGray/50
                    hover:text-green-500 hover:shadow-lg hover:border-green-500 hover:bg-green-100/20
                    transition-color duration-200"
		>
			<p className="text-lg font-medium">{children}</p>
		</button>
	);
};
