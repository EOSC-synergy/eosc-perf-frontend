import { type ChangeEvent, type FC, useState } from 'react';
import { Form, ProgressBar } from 'react-bootstrap';

type JsonSelectionProps = {
    fileContents?: string;
    setFileContents: (file?: string) => void;
};

/**
 * Form component to select a JSON file for upload
 *
 * @param props
 * @param props.fileContents string containing the json file
 * @param props.setFileContents callback to update the string containing the json
 */
const JsonSelection: FC<JsonSelectionProps> = ({ fileContents, setFileContents }) => {
    const [progress, setProgress] = useState(100.0);

    function loadFile(file?: File) {
        if (file === undefined) {
            setFileContents(undefined);
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            if (e.target?.result) {
                // readAsText guarantees string
                setFileContents(e.target.result as string);
            } else {
                setFileContents(undefined);
            }
            setProgress(100.0);
        });
        reader.addEventListener('progress', (e) => {
            setProgress((e.loaded / e.total) * 100);
        });

        reader.readAsText(file);
    }

    return (
        <div>
            <Form.Group>
                <Form.Label>Please select result JSON file</Form.Label>
                <Form.Control
                    type="file"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        loadFile(e.target.files ? e.target.files[0] : undefined)
                    }
                />
            </Form.Group>
            {progress !== 100.0 && <ProgressBar now={progress} label={`${progress}%`} />}
            {/* TODO: display result with formatting etc? */}
            {/*props.fileContents !== undefined ? props.fileContents : <div className="text-muted">No file loaded.</div>*/}
        </div>
    );
};

export default JsonSelection;
