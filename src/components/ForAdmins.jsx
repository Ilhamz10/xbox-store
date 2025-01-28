import { useStore } from '../store';

const ForAdmins = ({ PageForAdmin, PageForUsers }) => {
	const { isAdmin } = useStore();

	return <>{isAdmin ? PageForAdmin : PageForUsers}</>;
};

export default ForAdmins;
