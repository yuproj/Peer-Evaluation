# Peer Feedback Platform

A Flask-based web application for managing peer evaluations in classroom settings. Teachers can create classes, generate secure access links for students, and collect anonymous peer feedback on team projects.

## 🔒 Security Features

- **Password Hashing**: All passwords use werkzeug.security (pbkdf2:sha256)
- **Session Authentication**: 4-hour automatic timeout for students
- **CSRF Protection**: SameSite=Lax cookie policy
- **Device Restriction**: One device per student login (enforced via device tokens)
- **Time-Based Access**: Access links expire 4 hours after generation
- **Secure Cookies**: HTTPOnly and Secure flags enabled in production
- **SQL Injection Protection**: Supabase ORM prevents raw SQL queries
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS

## 📋 Environment Variables

Required environment variables (create a `.env` file for local development):

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
FLASK_ENV=development  # Set to 'production' for deployment
```

**Important**: See `.env.example` for template. Never commit `.env` to version control!

## 🚀 Quick Start (Local Development)

1. **Clone repository**:
```bash
git clone <repository-url>
cd peer-feedback-platform
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Run database migration**:
   - Open Supabase SQL Editor
   - Execute `migrations/add_security_columns.sql`

5. **Start application**:
```bash
python app.py
```

6. **Access application**: http://localhost:5001

## 🗄️ Database Schema

Required tables in Supabase PostgreSQL:

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `teachers` | Teacher accounts | email, password_hash |
| `classes` | Class information | name, access_code, teacher_id |
| `students` | Student accounts | name, student_id, passcode, team_id, access_expires_at, device_token |
| `teams` | Team assignments | name, class_id |
| `assignments` | Evaluation periods | name, class_id, start_date, end_date |
| `team_evaluations` | Team-level feedback | assignment_id, evaluator_id, team_id, rating, comments |
| `member_evaluations` | Individual feedback | assignment_id, evaluator_id, member_id, rating, comments |
| `access_tokens` | One-time access links | token, class_id, expires_at |

**Migration Required**: Execute `migrations/add_security_columns.sql` to add `access_expires_at` and `device_token` columns.

## 📦 Deployment to Vercel

**See `DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.**

Quick checklist:
1. ✅ Execute database migration in Supabase
2. ✅ Create GitHub repository (set to Private)
3. ✅ Generate SECRET_KEY
4. ✅ Connect GitHub to Vercel
5. ✅ Configure environment variables in Vercel
6. ✅ Deploy and verify security headers

## 🛡️ Security Checklist

Before deployment, review `SECURITY_CHECKLIST.md` for:
- ✅ Authentication & authorization controls
- ✅ Security headers configuration
- ✅ Environment variable setup
- ✅ Data protection measures
- 🔄 Optional enhancements (rate limiting, CAPTCHA, logging)

## 🔧 Key Features

### Teacher Portal
- Create and manage multiple classes
- Generate secure, time-limited access links for students/guests
- Add students manually or via access links
- Create evaluation assignments
- View aggregated peer feedback results

### Student Portal
- Join classes via secure access link
- Multi-class selection (if enrolled in multiple classes)
- Submit anonymous peer evaluations
- View team members
- Download evaluation results as PDF

### Evaluation Rules
- Students cannot evaluate their own team
- "Guests" group cannot be evaluated
- Members in "Guests" group can evaluate all other teams
- Unique team names enforced per class
- "Placeholder" members auto-created for new teams (except Guests)

## 🔐 Security Best Practices

- **Never commit** `.env` files to GitHub
- **Rotate SECRET_KEY** every 90 days in production
- **Use anon/public key** from Supabase (NOT service_role key)
- **Monitor logs** regularly for suspicious activity
- **Keep dependencies updated** for security patches
- **Review access patterns** monthly

## 🐛 Troubleshooting

### Session Expired Error
- Sessions timeout after 4 hours (by design)
- Teacher must generate new access link for students

### Device Restriction Error
- Students can only login from one device
- To switch devices, teacher must re-issue access link

### Database Connection Error
- Verify SUPABASE_URL and SUPABASE_KEY in environment variables
- Check Supabase project is active (not paused)

### ISO Datetime Parsing Error
- Ensure `parse_iso_datetime()` function is used (not `datetime.fromisoformat()`)
- Check Python version compatibility (3.9+)

## 📝 License

This project is for educational use. Contact administrator for licensing details.

## 📞 Support

For security vulnerabilities, contact the system administrator immediately.

For deployment issues, see `DEPLOYMENT_GUIDE.md` troubleshooting section.
