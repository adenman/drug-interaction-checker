import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [drugs, setDrugs] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [interactions, setInteractions] = useState(null);

    // This is our simulated interaction data for the demo
    const interactionRules = [
        { drugs: ["Warfarin", "Aspirin"], description: "Concurrent use significantly increases the risk of major bleeding.", severity: "Major" },
        { drugs: ["Warfarin", "Ibuprofen"], description: "Increases risk of gastrointestinal and other bleeding. Avoid if possible.", severity: "Major" },
        { drugs: ["Lisinopril", "Ibuprofen"], description: "NSAIDs like Ibuprofen may reduce the blood pressure-lowering effects of Lisinopril and increase risk of kidney damage.", severity: "Moderate" },
        { drugs: ["Lisinopril", "Aspirin"], description: "High-dose Aspirin may reduce the effectiveness of Lisinopril.", severity: "Minor" }
    ];

    useEffect(() => {
        // This URL assumes your backend is in a folder named 'drug-interaction-checker' in your local server's root
        axios.get('http://localhost/drug-interaction-checker/backend/api/get_drugs.php')
            .then(response => {
                if(Array.isArray(response.data)) {
                    setDrugs(response.data);
                }
            })
            .catch(error => console.error('Error fetching drugs:', error));
    }, []);

    const handleSelectDrug = (drug) => {
        if (selectedDrugs.length < 5 && !selectedDrugs.find(d => d.id === drug.id)) {
            setSelectedDrugs([...selectedDrugs, drug]);
        }
    };

    const handleRemoveDrug = (drugToRemove) => {
        setSelectedDrugs(selectedDrugs.filter(drug => drug.id !== drugToRemove.id));
    };

    const checkInteractions = () => {
        const selectedNames = selectedDrugs.map(d => d.name);
        let foundInteractions = [];

        for (let i = 0; i < selectedNames.length; i++) {
            for (let j = i + 1; j < selectedNames.length; j++) {
                const drug1 = selectedNames[i];
                const drug2 = selectedNames[j];
                const rule = interactionRules.find(r => r.drugs.includes(drug1) && r.drugs.includes(drug2));
                if (rule) {
                    foundInteractions.push({ pair: `${drug1} & ${drug2}`, ...rule });
                }
            }
        }
        setInteractions(foundInteractions.length > 0 ? foundInteractions : "No significant interactions found in our simulated dataset.");
    };

    const saveTest = () => {
        const testName = prompt("Enter a name for this test:");
        if (testName && selectedDrugs.length > 0) {
            const user_id = localStorage.getItem('user_id');
            const drug_ids = selectedDrugs.map(d => d.id);
            axios.post('http://localhost/drug-interaction-checker/backend/api/save_test.php', { user_id, test_name: testName, drug_ids })
                .then(() => alert('Test saved!'))
                .catch(error => console.error('Error saving test:', error));
        }
    };

    return (
        <div>
            <h2>Drug Interaction Checker</h2>
            <div className="disclaimer">
                <p><strong>Disclaimer:</strong> This tool uses a limited, simulated dataset for portfolio demonstration purposes only. It is <strong>not</strong> a substitute for professional medical advice. Do not rely on this tool for any health decisions.</p>
            </div>
            <h3>Select Drugs (up to 5)</h3>
            <div>
                {drugs.map(drug => <button key={drug.id} onClick={() => handleSelectDrug(drug)}>{drug.name}</button>)}
            </div>
            <h3>Selected Drugs</h3>
            <ul>
                {selectedDrugs.map(d => <li key={d.id}>{d.name} <button onClick={() => handleRemoveDrug(d)}>x</button></li>)}
            </ul>
            <button onClick={checkInteractions} disabled={selectedDrugs.length < 2}>Check Interactions</button>
            <button onClick={saveTest} disabled={selectedDrugs.length === 0}>Save Test</button>
            {interactions && (
                <div>
                    <h3>Interaction Results</h3>
                    {typeof interactions === 'string' ? <p>{interactions}</p> : interactions.map((inter, i) => (
                        <div key={i} style={{ border: `2px solid ${inter.severity === 'Major' ? 'red' : 'orange'}`, padding: '10px', margin: '10px 0' }}>
                            <p><strong>{inter.pair}</strong></p>
                            <p><strong>Severity: {inter.severity}</strong></p>
                            <p>{inter.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;