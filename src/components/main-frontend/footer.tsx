import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white p-4 mx-0 mb-8">
      

        <div className="mt-12 pt-8 border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Betting Platform. All rights reserved.
          </p>
        </div>
    </footer>
  )
} 