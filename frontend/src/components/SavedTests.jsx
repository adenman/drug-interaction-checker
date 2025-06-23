import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SavedTests = ({ loggedIn }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) {
            navigate('/login');
            return;
        }

        const fetchTests = async () => {
            try {
                const response = await axios.get('/api/get_user_tests.php');
                setTests(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Could not fetch saved tests.');
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [loggedIn, navigate]);

    if (loading) return <p>Loading saved tests...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="saved-tests-container">
            <h2>Your Saved Tests</h2>
            {tests.length === 0 ? (
                <p>You have not saved any tests yet.</p>
            ) : (
                <table className="tests-table">
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Drugs Tested</th>
                            <th>Date Saved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map((test) => (
                            <tr key={test.test_id}>
                                <td>{test.test_name}</td>
                                <td>{test.drugs}</td>
                                <td>{new Date(test.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SavedTests;