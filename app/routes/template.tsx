const Template = () => {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col">
            <div>
                <h1 className="text-primary text-4xl font-bold font-mono mb-6">
                    Uploading your own data
                </h1>
            </div>
            <div>
                <p className="mb-6">In order to upload a file, you need to make sure that your file implements the following rules described as below.
                    Furthermore, there is a template available for you to download and use. </p>
            </div>
            <div>
                <h2 className="text-primary text-2xl font-bold font-mono mb-6">
                    1. Check the file type and extension
                </h2>
            </div>
            <div>
                <p className="mb-6">Our platform supports the following file types:</p>
                <ul>
                    <li>- Excel, of file extension <b>.xls / .xlsx</b></li>
                    <li>- Comma Separated Values, of file extension <b>.csv</b></li>
                </ul>
            </div>
        </div>
    );
}

export default Template;
