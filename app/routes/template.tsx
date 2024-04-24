const Template = () => {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col">

            <div style={{ maxWidth: '800px' }}>
                <h1 className="text-primary text-4xl font-bold font-mono mb-6">
                    Uploading your own data
                </h1>
            </div>
            <div>
                <p className="mb-6">In order to upload a file, you need to make sure that your file implements the following rules described as below.
                    Furthermore, there is a template available for you to download and use. </p>
            </div>

            <div style={{ maxWidth: '800px' }}>
                <h2 className="text-primary text-2xl font-bold font-mono mb-6">
                    1. Check the file type and extension
                </h2>
            </div>
            <div>
                <p className="mb-6">Our platform supports the following file types:</p>
                <ul className="mb-6">
                    <li>- Excel, of file extension <b>.xls / .xlsx</b></li>
                    <li>- Comma Separated Values, of file extension <b>.csv</b></li>
                </ul>
                <p className="mb-6">If the file extension is NOT one of the above, then our application will reject the file, and ask you to try again.</p>
            </div>

            <div style={{ maxWidth: '800px' }}>
                <h2 className="text-primary text-2xl font-bold font-mono mb-6">
                    2. File structure
                </h2>
            </div>
            <div>
                <p className="mb-6">In order for the file to be successfully uploaded and read, it will need to follow a specific structure.
                    currently, there are two main ways of structuring the data inside your file:</p>
                <ul className="mb-6">
                    <li>- <b>Using address</b></li>
                    <li>- <b>Distance mode</b></li>
                </ul>
                <p className="mb-6">If the file extension is NOT one of the above, then our application will reject the file, and ask you to try again.</p>
            </div>

        </div>
    );
}

export default Template;
