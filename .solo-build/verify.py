"""Structural adapter integrity only. Never runs native commands or models."""
import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
data=json.loads((root/'.solo-build/adoption.json').read_text())
manifest=json.loads((root/'.solo-build/manifest.json').read_text())
required={'.solo-build/adoption.json','.solo-build/README.md','.solo-build/skills.json','.solo-build/intelligence.json','.solo-build/verify.py'}
errors=[]
if not required.issubset(manifest.get('files',{})): errors.append('Required baseline entry missing')
for name,digest in manifest.get('files',{}).items():
    if not name.startswith('.solo-build/') or '..' in name.split('/') or not isinstance(digest,str): errors.append('Invalid baseline path'); continue
    path=root/name
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=digest: errors.append('Changed adapter file: '+name)
if data.get('state')!='adoption-in-progress' or data.get('profile_verified') is not False or data.get('evidence_authenticated') is not False: errors.append('Unsupported acceptance claim')
if not (root/'AGENTS.md').is_file() or '.solo-build/README.md' not in (root/'AGENTS.md').read_text(): errors.append('Agent route missing')
print(json.dumps({'status':'invalid' if errors else 'structural-adapter-valid','errors':errors,'product_admission':data.get('admission'),'limitation':'No product tests, credentials, model calls or security enforcement verified.'},indent=2))
raise SystemExit(bool(errors))
