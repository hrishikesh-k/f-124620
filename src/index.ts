import {argv, cwd} from 'node:process'
import {existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'

const dir_style = argv[2] || '--recursive'
const dist_dir = join(cwd(), './dist/')
const html_end = '</body></html>'
const html_start = '<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta content="width=device-width,initial-scale=1.0" name="viewport"/><title>F-124620</title></head><body>'

let index_html = `${html_start}`

if (dir_style !== '--flat' && dir_style !== '--recursive') {
  throw new Error(`unknown option ${dir_style}`)
}

if (existsSync(dist_dir)) {
  rmSync(dist_dir, {
    force: true,
    recursive: true
  })
}

mkdirSync(dist_dir)


for (let dir_no = 0; dir_no < 5; dir_no ++) {

  let dir_index_html = `${html_start}`
  let dir_path = ''

  if (dir_style === '--flat' || dir_no === 0) {
    dir_path = join(dist_dir, `./dir-${dir_no}/`)
  } else {

    let dir_nesting_path = './dir-0'

    for (let dir_nesting = 1; dir_nesting <= dir_no; dir_nesting ++) {
      dir_nesting_path += `/dir-${dir_nesting}`
    }

    dir_path = join(dist_dir, `${dir_nesting_path}/`)
  }

  mkdirSync(dir_path)
  
  index_html += `<a href="/${dir_path.replace(dist_dir, '')}">Directory #${dir_no}</a><br/>`

  for (let file_no = 0; file_no < 30000; file_no ++) {
    writeFileSync(join(dir_path, `./${file_no}.html`), `${html_start}<p>File #${file_no}, generated at ${Date.now()}</p>${html_end}`)
    dir_index_html += `<a href="/${dir_path.replace(dist_dir, '')}${file_no}.html">File #${file_no}</a><br/>`
  }

  dir_index_html += `${html_end}`

  writeFileSync(join(dir_path, './index.html'), dir_index_html)

}

index_html += `${html_end}`

writeFileSync(join(dist_dir, './index.html'), index_html)