const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col gap-3 w-full p-4">
      <h2>Privacy Policy for Picture Outline Generator</h2>
      <p>
        <strong>Effective Date:</strong> 20 December 2024
      </p>

      <h3>1. Introduction</h3>
      <p>
        Welcome to Picture Outline Generator! Your privacy is important to us,
        and this Privacy Policy explains how we collect, use, and protect your
        information when you use our service.
      </p>

      <h3>2. Information We Collect</h3>
      <p>
        We may collect the following types of information when you use Picture
        Outline Generator:
      </p>
      <ul>
        <li>
          <strong>Images:</strong> We temporarily store the images you upload
          for processing. These images are automatically deleted after
          processing is complete.
        </li>
        <li>
          <strong>Usage Data:</strong> We collect anonymous usage statistics to
          help improve our service.
        </li>
      </ul>

      <h3>3. How We Use Your Information</h3>
      <p>The information we collect is used for the following purposes:</p>
      <ul>
        <li>
          <strong>Image Processing:</strong> To generate outlines around objects
          in your images using our AI-powered tools.
        </li>
        <li>
          <strong>Analytics:</strong> To analyze how the service is used,
          helping us improve functionality and performance.
        </li>
        <li>
          <strong>Service Management:</strong> To maintain and improve our
          service quality.
        </li>
      </ul>

      <h3>4. Data Storage and Retention</h3>
      <p>
        Images are stored only temporarily during processing and are
        automatically deleted afterward. We use secure, industry-standard
        practices to protect your data during transmission and processing.
      </p>

      <h3>5. User Rights</h3>
      <p>
        You have the right to request information about how your data is
        processed. To do so, please contact us at{" "}
        <a href="mailto:kshetez.vinayak@gmail.com">kshetez.vinayak@gmail.com</a>
        . We will respond to your request within a reasonable timeframe.
      </p>

      <h3>6. Third-Party Services</h3>
      <p>
        Picture Outline Generator uses AI models like Rembg/U2Net for image
        processing. These services process your images solely for the purpose of
        generating outlines and do not store or use your data for any other
        purposes.
      </p>

      <h3>7. Changes to This Policy</h3>
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices or legal requirements. We will notify you of any
        significant changes by posting the new policy on our website. Your
        continued use of Picture Outline Generator after any changes indicates
        your acceptance of the new terms.
      </p>

      <h3>8. Contact Us</h3>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at{" "}
        <a href="mailto:kshetez.vinayak@gmail.com">kshetez.vinayak@gmail.com</a>
        .
      </p>

      <h3>9. License</h3>
      <p>
        This service is licensed under the GNU Affero General Public License
        v3.0 (AGPL-3.0). The source code is available on our GitHub repository.
        For more details about the license and attribution requirements, please
        refer to our README.md.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
