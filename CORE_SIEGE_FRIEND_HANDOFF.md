# DROP8 코어 공성전 친구 작업 전달서

이 문서와 아래 GitHub 주소를 함께 전달하면 됩니다.

- 저장소: <https://github.com/jseung89/drop8-core-siege-public>
- 공성전 기준 브랜치: `main`
- 바로가기: <https://github.com/jseung89/drop8-core-siege-public/tree/main>

> 친구 작업은 원본 비공개 저장소가 아니라 위 공개 저장소의 `main`에서 시작합니다.

## 1. 내려받기와 실행

필요 환경:

- Git
- Node.js 22 이상
- pnpm 11.7.0

```bash
git clone https://github.com/jseung89/drop8-core-siege-public.git
cd drop8-core-siege-public
git switch main
corepack enable
pnpm install
pnpm check
pnpm dev
```

실행 후 브라우저에서 <http://localhost:2567>에 접속하고 `코어 공성전`을 선택합니다.

이미 저장소를 받았다면 작업 전에 갱신합니다.

```bash
git switch main
git pull origin main
pnpm install
pnpm check
```

## 2. 협업 단위

**캐릭터 1명 = 작업 브랜치 1개 = Pull Request 1개**로 진행합니다.

```bash
git switch main
git pull origin main
git switch -c hero/캐릭터-id
```

구현과 검증이 끝나면:

```bash
pnpm check
git add shared/src/coreSiege.ts server/src/rooms/Drop8Room.ts client/src/GameScene.ts shared/tests/coreSiege.test.ts server/tests/refactor064-core-siege.test.ts
git commit -m "feat: add core siege hero 캐릭터-id"
git push -u origin hero/캐릭터-id
```

그다음 작업 브랜치에서 `main`으로 PR을 만듭니다. 저장소 쓰기 권한이 없으면 Fork 후 PR을 만듭니다.

## 3. 캐릭터 코드가 있는 곳

현재 캐릭터는 하나의 클래스 파일로 분리되어 있지 않습니다. 아래 파일들이 함께 연결되어야 실제로 구동됩니다.

| 파일 | 담당 역할 |
|---|---|
| `shared/src/coreSiege.ts` | 캐릭터 ID, 체력, 기본 공격, Q/E/F 정보와 쿨다운 |
| `server/src/rooms/Drop8Room.ts` | 서버 권한 스킬 판정, 피해, 이동, 상태 이상, AI |
| `server/src/rooms/schema.ts` | 네트워크로 동기화되는 공성전 상태 |
| `client/src/GameScene.ts` | 캐릭터 외형, 조준 표시, 스킬 이펙트 |
| `client/src/main.ts` | 캐릭터 선택과 스킬 HUD |
| `client/src/network.ts` | 서버 상태와 이펙트 이벤트 수신 |
| `shared/tests/coreSiege.test.ts` | 캐릭터 공용 정의 테스트 |
| `server/tests/refactor064-core-siege.test.ts` | 서버 공성전 동작 테스트 |

## 4. 캐릭터 한 명 구현 순서

### A. 기획값 확정

```text
ID: 영문 camelCase
한글 이름:
역할:
원거리/근거리:
최대 체력:
기본 공격:
Q 스킬:
E 스킬:
F 궁극기:
외형과 대표 색상:
```

### B. 공용 정의 추가

`shared/src/coreSiege.ts`에서 다음을 연결합니다.

1. `CoreSiegeHeroId`에 ID 추가
2. 최대 체력 추가
3. 기본 공격 프로필 추가
4. `CORE_SIEGE_HEROES`에 이름, 역할, Q/E/F 설명과 쿨다운 추가
5. 근거리 캐릭터면 `CORE_SIEGE_MELEE_HERO_IDS`에도 추가

### C. 서버 스킬 구현

`server/src/rooms/Drop8Room.ts`의 `castCoreSiegeAbility`에 새 캐릭터 분기를 추가합니다.

```ts
} else if (heroId === 'newHeroId') {
  if (slot === 1) {
    // Q 서버 판정
    used = true;
  } else if (slot === 2) {
    // E 서버 판정
    used = true;
  } else {
    // F 서버 판정
    used = true;
  }
}
```

피해, 돌진, 방어, 상태 이상과 스킬 성공 여부는 서버가 결정해야 합니다. 기존 헬퍼로 만들 수 있는 스킬은 기존 코드를 재사용합니다.

### D. 클라이언트 표시

`client/src/GameScene.ts`에서 다음을 연결합니다.

- `drawCoreSiegeHeroDetails` 캐릭터 외형 분기
- 스킬 사거리, 방향, 범위 예고선
- 서버의 `coreSiegeEffect`에 대응하는 이펙트

### E. 테스트

```bash
pnpm check
pnpm dev
```

직접 코어 공성전에 들어가 선택, 스폰, 기본 공격, Q/E/F, 사망과 부활까지 확인합니다.

## 5. 참고할 기존 캐릭터

### 원거리: `vanguard` 강습병

- 공용 정의: `shared/src/coreSiege.ts`의 `vanguard`
- Q 범위 폭발: `castCoreSiegeGrenade`
- E 다중 투사체: `spawnCoreSiegeSkillBullets`
- F 직선 관통: `castCoreSiegePiercingBeam`
- 외형과 연출: `client/src/GameScene.ts`의 `vanguard` 분기

원거리 투사체, 범위 폭발, 직선 관통형 캐릭터를 만들 때 참고합니다.

### 근거리: `twinBlade` 쌍검 질주자

- 공용 정의: `shared/src/coreSiege.ts`의 `twinBlade`
- 근접 기본 공격: `meleeCoreSiegeHero`
- Q/F 질주 공격: `startCoreSiegeBladeRush`
- E 방어와 반격: `parryUntil`, `parryRecoveryUntil`
- 외형과 연출: `client/src/GameScene.ts`의 `twinBlade` 분기

근접 연타, 돌진, 패링형 캐릭터를 만들 때 참고합니다.

## 6. 완료 체크리스트

- [ ] 최신 `main`에서 독립 브랜치를 만들었다.
- [ ] 이번 PR에는 캐릭터 한 명만 들어 있다.
- [ ] 캐릭터 선택 화면에 표시된다.
- [ ] 체력과 기본 공격이 정상이다.
- [ ] Q, E, F가 서버 판정으로 작동한다.
- [ ] 플레이어, 미니언, 구조물 상호작용을 확인했다.
- [ ] 쿨다운과 스킬 레벨 성장이 적용된다.
- [ ] 캐릭터 외형과 스킬 이펙트가 보인다.
- [ ] 사망, 부활, 라운드 초기화 후에도 정상이다.
- [ ] AI 사용 여부를 확인했다.
- [ ] 테스트를 추가하거나 보완했다.
- [ ] `pnpm check`가 통과한다.
- [ ] 실제 코어 공성전에서 수동 테스트했다.

## 7. Claude 또는 다른 개발자에게 보낼 프롬프트

아래 내용을 복사해 캐릭터 기획 부분만 채워서 전달합니다.

```text
DROP8 코어 공성전 캐릭터 한 명을 기획하고 실제 구동되게 구현해줘.

저장소: https://github.com/jseung89/drop8-core-siege-public.git
기준 브랜치: main
작업 브랜치: hero/[character-id]

이번 작업 범위는 캐릭터 한 명뿐이다. 최신 기준 브랜치에서 시작하고 기존 구조를 먼저 분석해라. 불필요한 새 시스템이나 추상화는 만들지 말고 기존 헬퍼를 우선 재사용해라.

필수 수정 범위:
- shared/src/coreSiege.ts: ID, 체력, 기본 공격, 캐릭터 및 스킬 정의
- server/src/rooms/Drop8Room.ts: 서버 권한 기본 공격과 Q/E/F 판정
- client/src/GameScene.ts: 캐릭터 외형, 조준 표시, 이펙트
- 필요한 테스트 파일

캐릭터 기획:
- ID: [영문 camelCase]
- 이름: [한글 이름]
- 역할: [역할]
- 공격 방식: [원거리/근거리]
- 최대 체력: [수치]
- 기본 공격: [설명과 수치]
- Q: [설명과 수치]
- E: [설명과 수치]
- F: [설명과 수치]
- 외형: [형태와 색상]

완료 조건:
1. 캐릭터 선택, 스폰, 이동, 기본 공격, Q/E/F, 쿨다운, 사망과 부활이 정상 작동한다.
2. 플레이어, 미니언, 구조물 판정을 확인한다.
3. 클라이언트 이펙트가 서버 판정과 일치한다.
4. 테스트를 추가하고 pnpm check를 통과시킨다.
5. 변경 파일, 구현 내용, 밸런스 수치, 검사 결과와 수동 테스트 방법을 보고한다.
6. 이 캐릭터 외의 관계없는 코드는 수정하지 않는다.
```

## 8. 담당자가 PR을 합칠 때

1. PR의 대상 브랜치가 `main`인지 확인
2. 캐릭터 한 명 외의 관계없는 변경이 없는지 확인
3. `pnpm check` 결과 확인
4. PR 브랜치를 로컬에서 실행해 직접 플레이
5. 한 PR씩 병합
6. 각 병합 직후 기준 브랜치에서 다시 `pnpm check`

이렇게 하면 여러 사람이 동시에 작업해도 캐릭터별로 검수하고 문제가 생긴 PR만 따로 되돌릴 수 있습니다.
