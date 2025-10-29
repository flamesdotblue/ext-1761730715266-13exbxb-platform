import { useEffect, useId, useState } from 'react';

function Toggle({ label, checked, onChange, description, id }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-white">
      <div>
        <label htmlFor={id} className="font-medium text-gray-900">{label}</label>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function OTPInput({ value, onChange, error }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">6-digit code</label>
      <input
        id={id}
        inputMode="numeric"
        pattern="\\d{6}"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1 w-full px-3 py-2 rounded-md border ${error ? 'border-rose-500 ring-rose-200' : 'border-gray-300'} bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

export default function SettingsView() {
  const [twoFA, setTwoFA] = useState(false);
  const [method, setMethod] = useState('totp');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (!twoFA) {
      setOtp('');
      setOtpError('');
    }
  }, [twoFA]);

  function verify() {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError('Enter a valid 6-digit code.');
      return;
    }
    setOtpError('');
    alert('Two-factor authentication enabled');
  }

  return (
    <section aria-labelledby="settings-heading" className="space-y-6">
      <h2 id="settings-heading" className="text-xl font-semibold">Settings</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Toggle
            id="twofa-toggle"
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account."
            checked={twoFA}
            onChange={setTwoFA}
          />

          {twoFA && (
            <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3" aria-live="polite">
              <fieldset>
                <legend className="text-sm font-medium text-gray-700">Verification method</legend>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="method" value="totp" checked={method === 'totp'} onChange={() => setMethod('totp')} />
                    Authenticator App (TOTP)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="method" value="sms" checked={method === 'sms'} onChange={() => setMethod('sms')} />
                    SMS Code
                  </label>
                </div>
              </fieldset>

              {method === 'totp' && (
                <div className="text-sm text-gray-700">
                  <p className="mb-2">Scan the QR code in your authenticator app, then enter the 6-digit code to confirm.</p>
                  <div className="aspect-square w-28 rounded-md bg-gray-200 grid place-items-center text-gray-600">QR</div>
                </div>
              )}
              {method === 'sms' && (
                <div className="text-sm text-gray-700">
                  <p className="mb-2">We will send a verification code to your phone number ending in ••32.</p>
                  <button type="button" className="px-3 py-2 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">Send Code</button>
                </div>
              )}

              <OTPInput value={otp} onChange={setOtp} error={otpError} />
              <div className="flex gap-3">
                <button onClick={verify} className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">Verify & Enable</button>
                <button onClick={() => { setTwoFA(false); }} className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <h3 className="text-sm font-medium text-gray-800">Privacy</h3>
            <p className="text-sm text-gray-600 mt-1">We use industry-standard encryption and never store your credentials in plain text.</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <h3 className="text-sm font-medium text-gray-800">Accessibility</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Keyboard navigable interface</li>
              <li>ARIA landmarks and labels</li>
              <li>Color contrast compliant</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
