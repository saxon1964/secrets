const About = () => {
  return (
    <div class="container secretContainer">
      <h4 className="mt-2">Benefits of <span className="text-warning bg-primary p-1 rounded"
        style={{fontFamily: 'Georgia', fontWeight: 'bold', fontStyle: 'italic'}}>My Secrets</span></h4>
      <ul>
        <li>Your secrets are fully encrypted. Not a single byte of it is left unencrypted in the main database.</li>
        <li>Application supports password, credit cards, secret notes, ID documents and personal information.</li>
        <li>Unencrypted data is not transmitted over the wire.</li>
        <li>Your secrets are encrypted using your master password on your own (client) machine.</li>
        <li>Your master password is not stored anywhere. If it is forgotten, all your secrets are also forgotten.</li>
        <li>However, we can check if your master password is valid by trying to decrypt some random text that was
            created during master password creation phase</li>
        <li>Encryption of all secrets is performed with Standford Javascrpit Crypto Library
            (<a href='https://github.com/bitwiseshiftleft/sjcl/' target='_blank'>SJCL</a>)</li>
        <li>According to Stanford: SJCL is secure. It uses the industry-standard AES algorithm at 128, 192 or 256 bits;
            the SHA256 hash function; the HMAC authentication code; the PBKDF2 password strengthener; and the CCM and
            OCB authenticated-encryption modes. Just as importantly, the default parameters are sensible:
            SJCL strengthens your passwords by a factor of 1000 and salts them to protect against rainbow
            tables, and it authenticates every message it sends to prevent it from being modified.
            We believe that SJCL provides the best security which is practically available in Javascript.</li>
        <li>The site uses https:// as a protocol of choice.</li>
        <li>This project is open-source, hosted on <a href='https://github.com/saxon1964/secrets' target='_blank'>Github.</a></li>
        <li>This application is and will always be free.</li>
      </ul>
    </div>
  )
}

export default About
