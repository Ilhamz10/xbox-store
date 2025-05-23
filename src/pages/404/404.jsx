import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/');
	}, [navigate]);
	return;
};

export default NotFound;
