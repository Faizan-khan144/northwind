import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'
import { Button, Card, EmptyState } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={
          <Button as={Link} to="/dashboard" variant="primary">
            <Home size={16} /> Back to dashboard
          </Button>
        }
      />
      <p className="pb-8 text-center text-[11px] text-faint">Error 404</p>
    </Card>
  )
}
