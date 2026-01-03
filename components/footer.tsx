export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">GlobeTrotter</h3>
            <p className="text-sm text-gray-600">
              Plan your perfect multi-city adventure with intelligent travel planning.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Itinerary Builder</li>
              <li>Budget Tracking</li>
              <li>City Discovery</li>
              <li>Trip Sharing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Twitter</li>
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Blog</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          © {new Date().getFullYear()} GlobeTrotter. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
